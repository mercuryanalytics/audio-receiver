# frozen_string_literal: true

class Medium < ApplicationRecord
  has_many :parts, dependent: :delete_all

  BUCKET = "talaria-development"
  def transfer_to_s3
    raise "incomplete" unless complete? # TODO: handle this better

    s3client = Aws::S3::Client.new(region: "us-east-1")

    size = parts_in_sequence.sum("length(blob)")
    if size < 10.megabytes
      s3client.put_object(bucket: BUCKET, key: s3_key, body: parts_in_sequence.pluck(:blob).reduce(&:+))
    else
      use_multipart_upload
    end
  end

  def complete?
    parts.maximum(:sequence_number) == parts.count - 1 # FIXME: handle this better
  end

  def save_as(filename)
    raise "incomplete" unless complete?

    data = parts.order(:sequence_number).pluck(:blob).reduce(&:+)
    File.open(filename, "wb") { |f| f.write(data) }
  end

  def multiparts(size = 5.megabytes)
    blobs = parts_in_sequence.find_each(batch_size: 10).lazy.map(&:blob)
    en = Enumerator.new do |yielder|
      sz = 0
      buf = []
      loop do
        while sz < size
          b = blobs.next
          buf << b
          sz += block_given? ? yield(b) : b.size
        end
      rescue StopIteration
        break
      ensure
        yielder << buf
        buf = []
        sz = 0
      end
    end
    en.map { |group| group.reduce(&:+) }
  end

  private

  def s3_key
    "audio-recorder/#{rid}"
  end

  def parts_in_sequence
    @parts_in_sequence ||= parts.in_sequence
  end

  def use_multipart_upload
    description = { bucket: BUCKET, key: s3_key }
    upload = s3client.create_multipart_upload(description)
    description[:upload_id] = upload.upload_id

    multiparts.each do |part|
      s3client.upload_part(part.upload_description(description))
    end
    s3client.complete_multipart_upload(description)
  end
end

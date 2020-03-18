# frozen_string_literal: true

class Medium < ApplicationRecord
  has_many :parts, dependent: :delete_all

  REGION = "us-east-1"
  BUCKET = "talaria-development"
  def transfer_to_s3
    raise IncompleteMediumError unless complete?

    size = parts_in_sequence.sum("length(blob)")
    if size < 10.megabytes
      body = parts_in_sequence.pluck(:blob).reduce(&:+)
      s3_object.put(content_type: "audio/mpeg", body: body)
    else
      use_multipart_upload
    end
    self.url = s3_object.public_url
    save!
  end

  def s3_object
    Aws::S3::Resource.new(region: REGION).bucket(BUCKET).object(s3_key)
  end

  def complete?
    parts.maximum(:sequence_number) == parts.count - 1
  end

  def save_as(filename)
    raise IncompleteMediumError unless complete?

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
    "audio-recorder/#{rid}.mpeg"
  end

  def parts_in_sequence
    @parts_in_sequence ||= parts.in_sequence
  end

  def use_multipart_upload
    # TODO: use s3_object.initiate_multipart_upload
    desc = { bucket: BUCKET, key: s3_key, content_type: "audio/mpeg" }
    s3client = Aws::S3::Client.new(region: REGION)
    upload = s3client.create_multipart_upload(desc)
    desc[:upload_id] = upload.upload_id

    multiparts.each do |part|
      s3client.upload_part(part.upload_description(desc))
    end
    s3client.complete_multipart_upload(desc)
  end

  class IncompleteMediumError < StandardError; end
end

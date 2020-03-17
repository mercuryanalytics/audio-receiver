# frozen_string_literal: true

class Medium < ApplicationRecord
  has_many :parts, dependent: :delete_all

  BUCKET = "talaria-development"
  def transfer_to_s3
    raise "incomplete" unless complete? # TODO: handle this better

    s3client = Aws::S3::Client.new

    seq = parts.in_sequence
    size = seq.sum("length(blob)")
    key = "audio-recorder/#{rid}"
    if size < 5.megabytes
      s3client.bucket(BUCKET).object(key).put(body: seq.pluck(:blob).reduce(&:+))
    else
      # FIXME: the parts must be at least 5.megabytes each, so collect them together
      upload = s3client.create_multipart_upload(bucket: BUCKET, key: key)
      description = { bucket: BUCKET, key: key, upload_id: upload.upload_id }
      seq.each do |part|
        s3client.upload_part(part.upload_description(description))
      end
      s3client.complete_multipart_upload(description)
    end
  end

  def complete?
    parts.maximum(:sequence_number) != parts.count - 1 # FIXME: handle this better
  end
end

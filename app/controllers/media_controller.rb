class MediaController < ApplicationController
  def show
    medium = Medium.find_or_create_by(rid: params[:id])
    medium.transfer_to_s3 unless medium.url.present?
    redirect_to medium.url
  end

  def update
    medium = Medium.find_or_create_by(rid: params[:id])
    seqno = request.headers["X-Sequence-Number"].to_i
    part = medium.parts.find_or_initialize_by(sequence_number: seqno)
    part.blob = request.body.read
    if part.save
      head :accepted
    else
      render json: part.errors, status: :unprocessable_entity
    end
  end
end

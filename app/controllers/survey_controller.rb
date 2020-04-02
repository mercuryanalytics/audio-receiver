# frozen_string_literal: true

require 'auth_code_validator'

class SurveyController < ApplicationController
  before_action :validate_auth_code, if: -> { params[:id] == "index" && params.key?(:code) }
  before_action :check_rid

  def show
    session[:cell] = params[:cell] if params[:cell].present?
    render params[:id]
  end

  def update
    render params[:id]
  end

  private

  def check_rid
    Rails.logger.debug "In check_rid #{session[:rid].inspect}"
    return if params[:id] == "index" || session[:rid].present?

    Rails.logger.info "No rid in session"
    redirect_to index_path
  end

  def validate_auth_code
    Rails.logger.debug "In validating_auth_code"
    session[:rid] = nil
    auth_code_validator = AuthCodeValidator.new(3557, 25)
    auth_code = params[:code]
    if auth_code_validator.valid?(auth_code)
      session[:rid] = auth_code_validator.compute_rid(auth_code)
      Rails.logger.info "User-Agent: #{request.headers['User-Agent']}"
      redirect_to survey_path(id: :explain)
    else
      Rails.logger.info "Invalid code"
      redirect_to index_path, notice: "Invalid verification code—please try again"
    end
  end

  def browser_code
    @browser_code ||= begin
      auth_code_validator = AuthCodeValidator.new(3593, 25)
      auth_code_validator.compute_auth_code(session[:rid])
    end
  end
  helper_method :browser_code

  def cell_id
    ActiveSupport::StringInquirer.new(session[:cell] || "ted")
  end
  helper_method :cell_id
end

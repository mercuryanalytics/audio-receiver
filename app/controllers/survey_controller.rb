# frozen_string_literal: true

require 'auth_code_validator'

class SurveyController < ApplicationController
  before_action :check_rid

  def show
    @invalid = params[:invalid]
    session[:cell] = params[:cell] if params[:cell] && !session[:cell]

    case params[:id]
    when 'show_code'
      auth_code_validator = AuthCodeValidator.new(3593, 25)
      @code = auth_code_validator.compute_auth_code(session[:rid])
      render 'show_code'
    when 'no_sound'
      session[:rid] = 0
      redirect_to survey_path(id: :show_code)
    else
      render params[:id]
    end
  end

  def update
    if params[:id] == 'explain'
      if valid?(params[:code])
        redirect_to survey_path(id: :explain)
      else
        redirect_to survey_path(id: :index, invalid: 'true')
      end
    else
      redirect_to survey_path(id: params[:id])
    end
  end

  # index -- asks for authorization code
  # explain -- next to check mic
  # no_permission -- no mic permission
  # no_audio -- redirect to show_code with rid = 0
  # no_sound -- redirect to show_code with rid = 0
  # all_set -- next to learn to rate
  # instructions -- explains the buttons
  # show_code -- gives code to enter at survey
  # rate -- next on both
  # thankyou -- thanks for rating

  private

  def valid?(auth_code)
    auth_code_validator = AuthCodeValidator.new(3557, 25)
    if auth_code && auth_code_validator.valid?(auth_code)
      session[:rid] = auth_code_validator.compute_rid(auth_code)
      Rails.logger.info(request.headers['User-Agent'])
      return true
    end
    false
  end

  def check_rid
    Rails.logger.info "check_rid code: #{params[:code].inspect}, rid: #{session[:rid].inspect}"
    if valid?(params[:code])
      Rails.logger.info "valid code (explain)"
      redirect_to survey_path(id: :explain) # need window.location.href to be correct
    elsif session[:rid].nil?
      Rails.logger.info "no id in session"
      render 'index'
    else
      Rails.logger.info "valid rid"
    end
  end
end

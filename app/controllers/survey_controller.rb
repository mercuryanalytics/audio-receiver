# frozen_string_literal: true

require 'auth_code_validator'

class SurveyController < ApplicationController
  def show
    @invalid = params[:invalid]
    session[:cell] = params[:cell] if params[:cell] && !session[:cell]
    if valid?(params[:code])
      render 'explain'
    elsif session[:rid].nil?
      render 'index'
    elsif params[:id] == 'show_code'
      auth_code_validator = AuthCodeValidator.new(3593, 25)
      @code = auth_code_validator.compute_auth_code(session[:rid])
      render 'show_code'
    elsif params[:id] == 'no_sound'
      session[:rid] = 0
      redirect_to survey_path(id: :show_code)
    else
      render params[:id]
    end
  end

  def update
    if params[:id] == 'explain'
      if valid?(params[:auth_code])
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
  # mic_check -- perform mic check
  # no_audio -- no audio above threshold
  # no_sound -- no audio equipment
  # all_set -- next to learn to rate
  # instructions -- explains the buttons
  # show_code -- gives code to enter at survey
  # rate -- next on both
  # thankyou -- thanks for rating

  private

  def valid?(auth_code)
    auth_code_validator = AuthCodeValidator.new(3557, 25)
    if auth_code && auth_code_validator.valid?(auth_code)
      session[:rid] = auth_code_validator.compute_rid(auth_code) if auth_code
      return true
    end
    false
  end
end

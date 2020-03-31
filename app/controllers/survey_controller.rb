# frozen_string_literal: true

require 'auth_code_validator'

class SurveyController < ApplicationController
  def show
    auth_code = params[:auth_code]
    if params[:id] == 'index' && params[:cell_id]
      auth_code_validator = AuthCodeValidator.new(3557, 25)
      if auth_code_validator.valid?(auth_code)
        session[:rid] = auth_code_validator.compute_rid(auth_code) if auth_code
        render 'explain'
      else
        render 'index'
      end
    else
      render params[:id] # plain: "Hello #{params[:id]}"
    end
  end

  def update
    redirect_to survey_path(id: params[:id]) # plain: "Hello #{params[:id]}"
  end

  # index -- asks for authorization code
  # explain -- next to check mic
  # no_permission -- no mic permission
  # mic_check -- perform mic check
  # no_sound -- no sound
  # all_set -- next to learn to rate
  # instructions -- explains the buttons
  # show_code -- gives code to enter at survey
  # rate -- next on both
  # thankyou -- thanks for rating
end

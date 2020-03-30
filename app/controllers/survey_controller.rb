# frozen_string_literal: true
require "auth_code_validator"

class SurveyController < ApplicationController
  def show
    if params[:id] == "index" && params[:cell_id]
      auth_code_validator = AuthCodeValidator.new(3557, 25)
      render "explain" if auth_code_validator.compute_rid(params[:auth_code]).valid?
      render "index"
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
  # instructions -- next to learn to rate
  # rate -- explains the buttons
  # show_code -- gives code to enter at survey
  # page8 -- next on both
  # page9 -- thanks for rating
end

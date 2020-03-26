# frozen_string_literal: true

class SurveyController < ApplicationController
  def show
    render params[:id] # plain: "Hello #{params[:id]}"
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

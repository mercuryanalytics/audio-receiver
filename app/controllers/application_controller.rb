class ApplicationController < ActionController::Base
  def current_user
    session[:rid]
  end
end

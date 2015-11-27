class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :registerable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
         :validatable, :lockable, :confirmable
end

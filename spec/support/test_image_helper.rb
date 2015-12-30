class TestImageHelper
  def self.arnie_face_path
    File.join(Rails.root, 'spec', 'support', 'images', 'arnie_face.jpg')
  end

  def self.square_arnie_face_path
    File.join(Rails.root, 'spec', 'support', 'images', 'square_arnie_face.jpg')
  end
end

class TestImageHelper
  def self.large_image_path
    File.join(Rails.root, 'spec', 'support', 'images', 'large_image.jpg')
  end

  def self.arnie_face_path
    File.join(Rails.root, 'spec', 'support', 'images', 'arnie_face.jpg')
  end

  def self.square_arnie_face_path
    File.join(Rails.root, 'spec', 'support', 'images', 'arnie_face_square.jpeg')
  end
end

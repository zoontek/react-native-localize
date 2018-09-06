require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |spec|
  spec.name         = "RNLanguages"
  spec.summary      = "React Native properties and methods related to the language of the device"
  spec.version      = package['version']

  spec.authors      = { "Mathieu Acthernoene" => "zoontek@gmail.com" }
  spec.homepage     = "https://github.com/react-community/react-native-languages"
  spec.license      = "MIT"
  spec.platform     = :ios, "9.0"

  spec.source       = { :git => "https://github.com/react-community/react-native-languages.git" }
  spec.source_files = "ios/**/*.{h,m}"

  spec.dependency   "React"
end

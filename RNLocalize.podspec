require 'json'
package = JSON.parse(File.read('./package.json'))

Pod::Spec.new do |s|
  s.name                      = "RNLocalize"
  s.dependency                  "React-Core"

  s.version                   = package["version"]
  s.license                   = package["license"]
  s.summary                   = package["description"]
  s.authors                   = package["author"]
  s.homepage                  = package["homepage"]

  s.platforms                 = { :ios => "9.0", :tvos => "11.0", :osx => "10.14" }
  s.requires_arc              = true

  s.source                    = { :git => package["repository"]["url"], :tag => s.version }
  s.source_files              = "ios/*.{h,m}"
end

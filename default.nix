{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  pname = "dev";
  buildInputs = with pkgs; [
    ruby
    jekyll
  ];
  shellHook = ''
    alias install="bundle install"
    alias update="bundle update"
    alias run="bundle exec jekyll serve"
  '';
}

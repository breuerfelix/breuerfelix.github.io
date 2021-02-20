{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  pname = "dev";
  buildInputs = with pkgs; [
    ruby
    jekyll
  ];
}

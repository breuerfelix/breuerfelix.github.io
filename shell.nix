with (import <nixpkgs> {});
mkShell {
  buildInputs = [
    ruby
    jekyll
  ];
}

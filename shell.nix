with (import <nixpkgs> {});
mkShell {
  buildInputs = [
    ruby_3_4
  ];
}

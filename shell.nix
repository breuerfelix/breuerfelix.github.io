let
  pkgs = import <nixpkgs> {};
  rubySeries = pkgs.lib.concatStringsSep "_" (
    pkgs.lib.take 2 (pkgs.lib.splitString "." (pkgs.lib.trim (builtins.readFile ./.ruby-version)))
  );
in
pkgs.mkShell {
  packages = [
    pkgs.${"ruby_${rubySeries}"}
  ];
}

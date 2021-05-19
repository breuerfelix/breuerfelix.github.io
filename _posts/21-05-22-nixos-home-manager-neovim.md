---
layout: post
title: Neovim Nightly on NixOS with Home-Manager and Plugins from Git
date: 2021-05-19 11:00:00 +01:00
modify_date: 2021-05-19 17:00:00 +01:00
tags: nixos home-manager neovim nightly
category: blog
---

I recently switched to [NixOS](https://nixos.org/) with [Home-Manager](https://github.com/nix-community/home-manager) and wanted to try out [Neovim](https://github.com/neovim/neovim) Nightly aka Neovim 5.0.  
What is different on my setup? I will show you how to ditch all Plugin-Managers out there and use one Nix function to fetch all Neovim plugins from git. It will also keep them up-to-date everytime you rebuild your system.

I assume you already have Home-Manager installed on your system. Install Neovim Nightly:
```nix
nixpkgs.overlays = [
  (import (builtins.fetchTarball {
    url = https://github.com/nix-community/neovim-nightly-overlay/archive/master.tar.gz;
  }))
];

programs.neovim = {
  enable = true;
  package = pkgs.neovim-nightly;
};
```

Below is an example configuration of my custom Plugin-Manager.  
I tried adding comments to every important line.  
The function `pluginGit` creates a Nix Vim plugin with a builtin function called `buildVimPluginFrom2Nix`.
This function is a wrapper for almost every Vim plugin that you will find in the official NixPkgs.  
The downside of using the package from NixPkgs is, that your plugins only update when the package updates. Usually Vim Plugin-Managers always fetch the plugins from git, unless you specified a commit.  
This is also possible with my function. The first parameter is a commit, tag or branch. The `plugin` function is a wrapper around `pluginGit`, which defaults to `HEAD`. This will always point to the latest commit on the Repo.

```nix
{ config, pkgs, lib, vimUtils, ... }:
let
  # installs a vim plugin from git with a given tag / branch
  pluginGit = ref: repo: vimUtils.buildVimPluginFrom2Nix {
    pname = "${lib.strings.sanitizeDerivationName repo}";
    version = ref;
    src = builtins.fetchGit {
      url = "https://github.com/${repo}.git";
      ref = ref;
    };
  };

  # always installs latest version
  plugin = pluginGit "HEAD";
in {
  programs.neovim = {
    enable = true;
    package = pkgs.neovim-nightly;

    # read in the vim config from filesystem
    # this enables syntaxhighlighting when editing those
    extraConfig = builtins.concatStringsSep "\n" [
      (lib.strings.fileContents ./base.vim)
      (lib.strings.fileContents ./plugins.vim)
      (lib.strings.fileContents ./lsp.vim)

      # this allows you to add lua config files
      ''
        lua << EOF
        ${lib.strings.fileContents ./config.lua}
        ${lib.strings.fileContents ./lsp.lua}
        EOF
      ''
    ];

    # install needed binaries here
    extraPackages = with pkgs; [
      # used to compile tree-sitter grammar
      tree-sitter

      # installs different langauge servers for neovim-lsp
      # have a look on the link below to figure out the ones for your languages
      # https://github.com/neovim/nvim-lspconfig/blob/master/CONFIG.md
      nodePackages.typescript nodePackages.typescript-language-server
      gopls
      nodePackages.pyright
      rust-analyzer
    ];
    plugins = with pkgs.vimPlugins; [
      # you can use plugins from the pkgs
      vim-which-key

      # or you can use our function to directly fetch plugins from git
      (plugin "neovim/nvim-lspconfig")
      (plugin "hrsh7th/nvim-compe") # completion
      (plugin "Raimondi/delimitMate") # auto bracket

      # this installs the plugin from 'lua' branch
      (pluginGit "lua" "lukas-reineke/indent-blankline.nvim")

      # syntax highlighting
      (plugin "nvim-treesitter/nvim-treesitter")
      (plugin "p00f/nvim-ts-rainbow") # bracket highlighting
    ];
  };
}
```

Let me know what you think in the comments below! I am open for new enhancements :)

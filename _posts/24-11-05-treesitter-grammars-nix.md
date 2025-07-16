---
layout: post
title: Neovim Treesitter Grammars with Nix and lazy.nvim
date: 2024-11-05 09:00:00 +01:00
tags: nix home-manager neovim treesitter grammars lazy
category: blog
---

I recently managed to install my Neovim plugins with Nix but lazy-load them with [lazy.nvim](https://github.com/folke/lazy.nvim) (blog post coming soon).  
One milestone was to install all Treesitter grammars via Nix and make them available to Neovim.  
The Treesitter Nix package has a handy plugin called `pkgs.vimPlugins.nvim-treesitter.withAllGrammars` to install all compiled grammars at once.  
Somehow, this was hard to set up if you are not bootstrapping your Neovim plugins with the Nix Neovim module (and instead use lazy.nvim).

Here is a little snippet on how to link all compiled Treesitter grammars to your runtimepath. The Treesitter plugin will automatically pick them up since it searches for `<grammar>.so` in your runtimepath (rtp). No more config needed (of course, you still need to install the Treesitter plugin).

```nix
luaConfigSnippet = let grammarsPath = pkgs.symlinkJoin {
  name = "nvim-treesitter-grammars";
  paths = pkgs.vimPlugins.nvim-treesitter.withAllGrammars.dependencies;
}; in 
# lua 
''
    -- also make sure to append treesitter since it bundles some languages
    vim.opt.runtimepath:append("${pkgs.vimPlugins.nvim-treesitter}")
    -- append all *.so files
    vim.opt.runtimepath:append("${grammarsPath}")
''
```

Just integrate this snippet into your existing Neovim Lua config.

lick [HERE](https://github.com/breuerfelix/feovim/blob/main/syntax.nix) to see how I integrated it into my setup.

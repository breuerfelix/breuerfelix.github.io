---
layout: post
title: Neovim Treesitter Grammars with Nix with lazy.nvim
date: 2024-11-05 09:00:00 +01:00
tags: nix home-manager neovim treesitter grammars lazy
category: blog
---

I recently managed to install my neovim plugins with nix but lazy load them with [lazy.nvim](https://github.com/folke/lazy.nvim) (blog post coming soon).  
One milestone was to install all treesitter grammars via nix and make them available to neovim.  
The treesitter nix package has a handy plugin called `pkgs.vimPlugins.nvim-treesitter.withAllGrammars` to install all compiled grammars at once.  
Somehow this was hard to setup if you are not bootstrapping your neovim plugins with the nix neovim module (and instead use lazy.nvim).

Here is a little snippet on how to link all compiled treesitter grammars to your runtimepath. The treesitter plugin will automatically pick them up since he searches for `<grammer>.so` in your runtimepath (rtp). No more config needed (of course you still need to install the treesitter plugin).

```nix
luaConfigSnippet = let grammarsPath = pkgs.symlinkJoin {
  name = "nvim-treesitter-grammars";
  paths = pkgs.vimPlugins.nvim-treesitter.withAllGrammars.dependencies;
}; in 
# lua 
''
    vim.opt.runtimepath:prepend("${grammarsPath}")
''
```

Just integrate this snippet into your existing neovim lua config.

Click [HERE](https://github.com/breuerfelix/feovim/blob/main/syntax.nix) to see how I integrated it into my setup.

---
layout: post
title: Neovim with Nix and Lazy.nvim
date: 2024-11-30 09:00:00 +01:00
tags: neovim nix flake portable lazy.nvim
category: blog
---

__tl;dr:__ Check out [this](https://github.com/breuerfelix/feovim) GitHub Repository for an example.  

You may already know that I manage my Neovim with Nix since I wrote [some articles](/blog/nixos-home-manager-neovim) in the past about my current setup.  
Recently I got really upset about my neovim startup time. It was too slow ... it is always to slow!  
Nix always loads all plugins at startup. There is a lazy loading feature but this is not as mature as [lazy.nvim](https://github.com/folke/lazy.nvim).  
New sidequest unlocked. __Lazy.nvim with plugins managed by nix.__  

> Let's have a look on the world wide web, someone already did that!
>
> -- <cite>naive me</cite>

No one did it... well at least no one wrote about it.

First add the lazy.nvim plugin as the only plugin that is managed by nix and configure it.  
The `# lua` comment is important since it enables lua syntax highlighting for the string inside a nix file.

```nix
programs.neovim = {
  # ...
  plugins = [ pkgs.vimPlugins.lazy-nvim ];
  extraLuaConfig =
    # lua
    ''
      require("lazy").setup({
        -- disable all update / install features
        -- this is handled by nix
        rocks = { enabled = false },
        pkg = { enabled = false },
        install = { missing = false },
        change_detection = { enabled = false },
        spec = {
          -- TODO
        },
      })
    '';
};
```

According to the [PluginSpec](https://lazy.folke.io/spec) we can install plugins from a local path with the `dir` parameter. Lets leverage this to manage the plugin source with nix and lazy loading with lazy.nvim.  
As an example we will install `nvim-cmp` with all dependencies.

```nix
programs.neovim = {
  # ...
  extraLuaConfig = with pkgs.vimPlugins;
    # lua
    ''
      require("lazy").setup({
        -- ...
        spec = {
          {
            -- since we used `with pkgs.vimPlugins` this will expand to the correct path
            dir = "${nvim-cmp}",
            name = "nvim-cmp",
            event = { "InsertEnter", "CmdlineEnter" },
            dependencies = {
              -- we can also load dependencies from a local folder
              { dir = "${cmp-nvim-lsp}", name = "cmp-nvim-lsp" },
              { dir = "${cmp-path}", name = "cmp-path" },
              { dir = "${cmp-buffer}", name = "cmp-buffer" },
              { dir = "${cmp-cmdline}", name = "cmp-cmdline" },
            },
            config = function ()
              local cmp = require('cmp')

              cmp.setup({
                sources = cmp.config.sources({
                  { name = 'nvim_lsp' },
                  { name = 'path' },
                }),
                snippet = {
                  expand = function(args)
                    vim.snippet.expand(args.body)
                  end,
                },
                mapping = cmp.mapping.preset.insert({}),
              })

              -- Use buffer source for `/` and `?`
              cmp.setup.cmdline({ '/', '?' }, {
                mapping = cmp.mapping.preset.cmdline(),
                sources = {
                  { name = 'buffer' },
                },
              })

              -- Use cmdline & path source for ':'
              cmp.setup.cmdline(':', {
                mapping = cmp.mapping.preset.cmdline(),
                sources = cmp.config.sources({
                  { name = 'path' },
                }, {
                  { name = 'cmdline' },
                }),
                matching = { disallow_symbol_nonprefix_matching = false },
              })
            end,
          },
        },
      })
    '';
};
```

Et voila, now you can update your plugins via nix and lazy load via lazy.nvim.  
I split up the lazy config into different files so my neovim config stays clean and won't get messy. Just have a look at the repository I linked in the top.

[Read this](/blog/nixos-home-manager-neovim) to learn how to install plugins that are not present in the nix package repository.  
[Read this](/blog/treesitter-grammars-nix) to learn how to install treesitter grammars with nix aswell.  

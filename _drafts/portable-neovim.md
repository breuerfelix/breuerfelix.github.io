TLDR; just run MY NeoVim! Try this: `nix run github:breuerfelix/feovim# .`

Link to my Neovim Distribution: https://github.com/breuerfelix/feovim
I have a readme on how you can create your own config

- i stumbled across nix and use it to declare my system
- i use nix to manage my dotfiles
- my neovim config made half of my dotfiles repo
- i wanted to extract my neovim config into another repo
- nix introduced flakes
- you can run remote flakes
- the idea came up to capsulate my neovim into its own custom program
- if you want to learn more about nix, check out my blog article about it: breuer.dev/blog/nix

benefits:
- you can run multiple neovim instances on one machine
- i can run my own neovim on any machine that has nix installed without affecting the other computer
- they can try out my neovim without ditching their own
- i can easily run my vim on remote machines or servers
- i can show off my neovim to other people
- this would be awesome for neovim distributions like lazyvim or astrovim since you can install these distros independently to try them out and its easier for other people to test them
- unlike other package managers, my neovim distro can also include language servers in the final package / distribution
- language servers are consumed by nix packages so they are also included in the final neovim distribution and won't affect other languges installed since nix has its own environments
- all plugins have pinned versions
- if there is a plugin which is not on nix packages you can use the helper function i programmed to install them directly from git

downsides:
- if you also install language servers with your neovim, it takes long to install for the first time. after that, nix caches everything
- i haven't figured out how to properly configure lazy loading plugins, feel free to leave a hint in the comments

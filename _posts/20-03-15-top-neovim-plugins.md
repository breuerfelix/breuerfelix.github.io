---
layout: post
title: Top NeoVim Plugins of 2020
date: 2020-03-12 11:00:00 +01:00
modify_date: 2020-03-13 11:00:00 +01:00
tags: top 2020 neovim plugins editor ide
category: blog
---

I recently tried to find some new interesting NeoVim plugins and realised that there are not many people blogging about their setup in 2019/2020.  
There are many outdated configs and plugin suggestions.  
I wanna go through the must have plugins (in my opinion) starting from the most important one.

__FYI__: my [dotfiles](https://github.com/breuerfelix/dotfiles) / [.vimrc](https://github.com/breuerfelix/dotfiles/blob/master/shell/.vimrc)
<!--more-->

I always try to add some sensible default configuration that I use for each plugin.

## #1 - vim-plug

We are talking about plugins here so this one has to be rank 1.  
[vim-plug](https://github.com/junegunn/vim-plug) allows easy plugin management.  
I never tested others but I also do not feel like switching because it works like a charm.

There is even an auto installation script. Just add this on top of your `.vimrc` file.
```vim
"automated installation of vimplug if not installed
if empty(glob('~/.local/share/nvim/site/autoload/plug.vim'))
    silent !curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs
        \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
    autocmd VimEnter * PlugInstall --sync | source ~/.config/nvim/init.vim
endif

call plug#begin('~/.config/nvim/plugged')

"plugins here, coc for example
Plug 'neoclide/coc.nvim', { 'branch': 'release' }

call plug#end()
```

## #2 - Conquer of Completion

I love the intellisense from VSCode. Especially if you work in big teams or continue projects after some time.  
You never remember every single variable declared back in the days.  
[CoC](https://github.com/neoclide/coc.nvim) helps you wipe out errors before they even happen.

I used [deoplete](https://github.com/Shougo/deoplete.nvim), switched to [YouCompleteMe](https://github.com/ycm-core/YouCompleteMe), tested [TabNine](https://github.com/codota/TabNine) and finally arrived at CoC.  
You don't have to take all these steps, just use it right from the start and have fun coding in vim!

Don't forget to install the language servers you want to use (e.g. `:CocInstall coc-python`)!

```vim
Plug 'neoclide/coc.nvim', { 'branch': 'release' }

inoremap <expr> <Tab> pumvisible() ? "\<C-n>" : "\<Tab>"
inoremap <expr> <S-Tab> pumvisible() ? "\<C-p>" : "\<S-Tab>"

inoremap <silent><expr> <C-space> coc#refresh()

"GoTo code navigation
nmap <leader>g <C-o>
nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gt <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)

nmap <leader>rn <Plug>(coc-rename)

"show all diagnostics.
nnoremap <silent> <space>d :<C-u>CocList diagnostics<cr>
"manage extensions.
nnoremap <silent> <space>e :<C-u>CocList extensions<cr>
```

## #3 - fzf

This awesome [fuzzy finder](https://github.com/junegunn/fzf.vim) lets you navigate through your project in seconds.  
I only used [NERDTree](https://github.com/preservim/nerdtree) in the past and also use it some times, but fzf boosted my file search to the moon.

After using fzf for some time you will also notice that your file naming conventions will improve!  
The file and folder names will actually be named after what's really inside.

```bash
export FZF_DEFAULT_COMMAND='fdfind --type f --hidden --follow --exclude .git --exclude .vim'
```

```vim
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'

map ; :Files<CR>
```

## #4 - Window splitting / movement

This is not a plugin but I use this configuration in every single Vim session.

```vim
function! WinMove(key)
    let t:curwin = winnr()
    exec "wincmd ".a:key
    if (t:curwin == winnr())
        if (match(a:key,'[jk]'))
            wincmd v
        else
            wincmd s
        endif
        exec "wincmd ".a:key
    endif
endfunction

nnoremap <silent> <C-h> :call WinMove('h')<CR>
nnoremap <silent> <C-j> :call WinMove('j')<CR>
nnoremap <silent> <C-k> :call WinMove('k')<CR>
nnoremap <silent> <C-l> :call WinMove('l')<CR>
```

It is using vim keys (for sure): `j - down / k - up / ...`  
Quick example:  
If you press `ctrl + j` and there is a pane below your pane, switch to it.  
Otherwhise create a new split pane below.

## #5 - Auto Pairs

Probably something that you need for every single programming language.  
[Auto Pairs](https://github.com/jiangmiao/auto-pairs) just adds a closing bracket, paren, quote or whatever you need!

It is a zero configuration plugin and works well with [vim-sandwich](https://github.com/machakann/vim-sandwich) which I also really want to mention here.

```vim
Plug 'jiangmiao/auto-pairs'
Plug 'machakann/vim-sandwich'
```

## #6 - NERD Commenter

Sometimes you just wanna comment out your new function just to check if you suck or if the program was already broken before.  
Check out [this plugin](https://github.com/preservim/nerdcommenter) for language agnostic easy commenting your code.

```vim
Plug 'preservim/nerdcommenter'
```

## #7 - Tabs or Spaces ?

Doesn't matter anymore! Let [vim-sleuth](https://github.com/tpope/vim-sleuth) analyse the project and decide the spacing for you.  
Just remove all your spacing settings in your `.vimrc` and this plugin will set them automatically each time you open up vim.

This works really great with [EditorConfig](https://github.com/editorconfig/editorconfig-vim). If you often work on other projects there are plenty of different style guides.  
After using these two plugins you don't always have to adjust your `.vimrc` each time.

```vim
Plug 'tpope/vim-sleuth'
Plug 'editorconfig/editorconfig-vim'
```

## #8 - gitgutter

Many people are using [fugitive](https://github.com/tpope/vim-fugitive) for managing git with vim.  
It is a really great plugin with many features, but I like it minimalistic.

Thats why I would like to show you [gitgutter](https://github.com/airblade/vim-gitgutter), which just displays you little icons on the sidebar of each file indicating if a line is modified or added.

```vim
Plug 'airblade/vim-gitgutter'
Plug 'tpope/vim-fugitive'
```

---

I forgot your favorite plugin? Just email me, I would love to explore more Vim plugins (:

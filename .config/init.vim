"General settings
syntax on
set autoindent 
set smartindent
set ruler
set cursorline
set mouse=a
set clipboard=unnamedplus
set number "nu"
set relativenumber "rnu"
set hlsearch "hls"
set ts=4 "set tabstop=4
set sw=4 "shiftwidth=4"
set termguicolors

filetype off
filetype indent on 

"Sourcing
	source $HOME/.config/nvim/vim-plug/plugins.vim
	"source $HOME/.config/nvim/plug-config/coc.vim


"keybindings/mapings (\a to select all text)
nnoremap <Leader>a ggVG 
imap kj  <Esc>

" Complete brackets
inoremap {<CR>  {<CR>}<Esc>O
inoremap {} {}
inoremap {      {}<Left>
inoremap {{     {

"Searching
set hlsearch
set incsearch
set ignorecase
set smartcase

"C++ compile&run
autocmd filetype cpp nnoremap <F9> :w <bar> !clang++ -std=c++20 % -o output.out <CR>
autocmd filetype cpp nnoremap <F10> :!./output.out<CR>

 

let g:dracula_termcolors=256
colorscheme dracula
"transparency
hi Normal guibg=NONE ctermbg=NONE

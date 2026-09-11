# [odd.horse](https://odd.horse)

website for the music artist [oddhorse](https://odd.horse)

## history

same git repo since jan 2020 :P old versions are tagged so feel free to peruse or whateva

version 7 is new and mysterious and artifact-based. read my pdfs why don't you
version 6 is template based using 11ty and nunjucks
version 5 was trying to be a single page app lmao

## tools

- node.js
- 11ty for static site generation
- nunjucks for template language (GUYS THIS IS SO SICK BTW EVEN THOUGH ITS LIKE A MILLION EARS OLD) (GUYS update dec 31 2025 I WANT TO PHASE OUT NUNJUCKS BECAUSE IT FEELS OLDDDDDDDDDDDDD)
- github actions for auto deployment to server

## to-do

### before first release

[ ] fix mobile layout
[ ] make envelope gacha mechanic artifact
[x] fix debug functions not present in production (wipe()/help() exposed from homepage.js)
[ ] make back button close modal on modal click
[ ] make fortune generator
[ ] make oddhorse logo do price is right thing if clicked in right order
[ ] hardcode artifact urls to not have a subfolder.
[ ] make new layout page for artifacts that just embeds the head in there with no header/whatever, in case we need to make artifacts that are actual pages themselves
[x] spiffy up the head declaration. (fixed: it referenced a `site` global that never existed, so canonical/og:url were relative and og:image was empty. now uses `meta`.)
[ ] add/investigate existing content security policy <https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP>
[ ] add prefetch rules for subpages <https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API>
[ ] add styling for blog posts
[ ] streaming link icons that, on mouseover, change randomdistortions put on them
[ ] add stampede button to list of artifacts
 when you click too many times in a period of time they get  tired and refuse to stampede
[ ] finish mouseover effects and onclick audio snippets for each letter in header logo
[ ] custom cursor
[ ] fix mobile artifact list width
[ ] add oddhorse image to artifacts
[ ] make background with canvas
[ ] make little pixel icons
[ ] make on hover effects clearer for logo pieces

### bigger fish and also things i'm kicking down the roooooadddd

[ ] notification opt-in for new updates
[x] **ARCHITECTURE REFACTORING** - mostly done
  [x] consolidate logo hover system - it was 5x duplicated, not 4x. now one delegated
      listener in logo-hover.js, and every element just declares `--hover-color`.
      side effect: dynamically added links tint the logo now, which they never did.
  [x] delete colors.js - replaced by relative color syntax in global.css.
      3 of the 5 colors it computed were used by exactly nothing.
  [x] cut CLAUDE.md from 609 lines to ~150. most of it described an architecture
      that had already been refactored away (bundle plugin, main.js, inline blocks).
  [ ] move core.js loading from head.njk to index.njk only - SKIPPED on purpose.
      core.js is ~4KB now and treats/404 still want the logo hover. not worth it.
  [ ] consider inlining header/footer/modals into index.njk if never adding to other pages
  [ ] make a real 1200x630 og:image - currently falls back to the 512x512 chrome icon
[ ] guestbook
[ ] pharaoh (clippy-style guy) who gives you hints. "have you seen the STAMPEDE yet?"
[ ] user login so they can collect easter eggs? idk
[ ] jukebox page
[ ] osu!mania-style rhythm game (vertical scrolling, multiple lanes, timing-based)
[ ] make contact page template-based
[ ] rank streaming service list by least to most evil
[ ] oddhorse clicker game where you're hitting me with a hammer and secrets fall out
[ ] email template system for contact page
[ ] make rotating horse cube
[ ] 3d "garden"
[ ] little ai chatbot that sucks and you can pry secrets from
[ ] make a famousbirthdays page?
[ ] specifically add web application stuff to head and site

## credits

oddhorse, first of all

claude, for a little help in refactoring things

### fonts in use

Karrik by Jean-Baptiste Morizot, Lucas Le Bihan. Distributed by [velvetyne.fr](https://velvetyne.fr) and licensed under [SIL Open Font License, Version 1.1](http://scripts.sil.org/OFL).

Degheest by Ange Degheest, Camille Depalle, Eugénie Bidaut, Luna Delabre, Mandy Elbé, May Jolivet, Oriane Charvieux, Benjamin Gomez, and Justine Herbel. only using FT88 subsets which i think were done by Oriane Charvieux but not sure. Distributed by [velvetyne.fr](https://velvetyne.fr) and licensed under [SIL Open Font License, Version 1.1](http://scripts.sil.org/OFL).

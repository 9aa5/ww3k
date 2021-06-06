function process_word_list(whole_file) {
   var line_num, i, group, normalized, trimmed_word;
   lines = whole_file.split(/\r?\n/);
   word_group_list = [];
   for (line_num = 0; line_num < lines.length; line_num +=1) {
      group = lines[line_num].split(',')
      if (group.length == 0) {
         continue;
      }
      normalized = [];
      for (i = 0; i < group.length; i += 1) {
         trimmed_word = group[i].trim();
         if (trimmed_word.length) {
            normalized.push(trimmed_word);
         }
      }
      if (normalized.length) {
         word_group_list.push(normalized);
      }
   }
   return word_group_list;
}

function get_dom_for_word_group(word_group) {
   let group_root = document.createElement('div');
   for (let i = 0; i < word_group.length; i += 1) {
      let word_link_dom = document.createElement('word-link');
      let span_for_slot = document.createElement('span');
      span_for_slot.setAttribute('slot', 'word');
      span_for_slot.textContent = word_group[i];
      word_link_dom.setAttribute('data-word', word_group[i]);
      word_link_dom.appendChild(span_for_slot);
      group_root.appendChild(word_link_dom);
   }
   return group_root;
}

function fill_page(words_list) {
   var i, word_group_dom;
   let root_elem = document.getElementById('word_group_root');
   for (i = 0; i < words_list.length; i += 1) {
      word_group_dom = get_dom_for_word_group(words_list[i]);
      root_elem.appendChild(word_group_dom);
   }
}

function on_word_click(elem) {
   let word_value = elem.getAttribute('data-word');
   let google_query = 'https://www.google.com/search?q=define+' + word_value;
   console.log('clicked on word' + word_value);
   window.open(google_query, 'google_dict');
}

function load_words(on_loaded) {
   customElements.define('word-link',
      class extends HTMLElement {
         constructor() {
            super();
            let template = document.getElementById('word_link_template');
            let templateContent = template.content;
            const shadowRoot = this.attachShadow({mode: 'open'})
              .appendChild(templateContent.cloneNode(true));
            this.onclick = function() { on_word_click(this); }
         }
      }
   );

   var xmlHttp = new XMLHttpRequest();
   xmlHttp.open('GET', 'words_list.txt', true);
   xmlHttp.addEventListener('load', function (evt) {
      console.log('Word list is retrieved.');
      let words_list = process_word_list(evt.target.responseText);
      fill_page(words_list);
   }, false);
   xmlHttp.send();
}

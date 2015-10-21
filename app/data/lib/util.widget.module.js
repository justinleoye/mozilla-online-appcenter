var AppcenterModules = AppcenterModules || {};
AppcenterModules.Widget = AppcenterModules.Widget || {};
AppcenterModules.Widget.Util = AppcenterModules.Widget.Util || {};

$(function(){
  AppcenterModules.Widget.Util.createWordTranslationDom = function(data){
    let translateArea = document.createElement('div');
    translateArea.setAttribute('class', 'bubble-content');

    let json = JSON.parse(data);
    if (json.error_code || json.code) return;
    let symbols = json.word_result.simple_means.symbols[0];
    let parts = symbols['parts'];
    let wordText = json.word_result.simple_means.word_name;

    let word = document.createElement('div');
    word.setAttribute('class', 'livemargins-word');
    word.textContent = wordText;
    if (symbols.ph_en) {
      let span = document.createElement('span');
      span.textContent = ' 英 [' + symbols.ph_en + ']';
      word.appendChild(span);
    }
    if (symbols.ph_am) {
      let span = document.createElement('span');
      span.textContent = ' 美 [' + symbols.ph_am + ']';
      word.appendChild(span);
    }
    translateArea.appendChild(word);
    $.each(parts, function(i, part){
      let item = document.createElement('p');
      item.setAttribute('class', 'livemargins-item');
      item.textContent = part.part + ' ' + part.means.join(',');
      translateArea.appendChild(item);
    })

    let more = document.createElement("a");
    more.setAttribute('class', 'livemargins-more');
    more.textContent = '查看更多';
    more.href = 'http://www.iciba.com/' + wordText;
    more.setAttribute('target', '_blank');
    let p = document.createElement("p");
    p.setAttribute('class', 'livemargins-item');
    p.appendChild(more);
    translateArea.appendChild(p);

    let brand = document.createElement('div');
    brand.setAttribute('class', 'livemargins-brand-kingsoft');
    brand.textContent = '以上内容来自 ';
    let link = document.createElement("a");
    link.textContent = '金山词霸';
    link.href = 'http://www.iciba.com/';
    link.setAttribute('target', '_blank');
    brand.appendChild(link);
    translateArea.appendChild(brand);

    return translateArea;
  };

  AppcenterModules.Widget.Util.createSentenceTranslationDom = function(data){
    let translateArea = document.createElement('div');
    translateArea.setAttribute('class', 'bubble-content');

    let json = JSON.parse(data);
    let p = document.createElement('p');
    let result = '';
    $.each(json.translation[0]['translated'], function(i, t){
      result += t['text'].trim();
    });
    if (!result) return;
    p.textContent = result;
    translateArea.appendChild(p);

    let brand = document.createElement('div');
    brand.setAttribute('class', 'livemargins-brand-yeekit');
    brand.textContent = '以上内容来自 ';
    let link = document.createElement('a');
    link.textContent = '译库';
    link.href = 'http://www.yeekit.com/';
    link.setAttribute('target', '_blank');
    brand.appendChild(link);
    translateArea.appendChild(brand);

    return translateArea;
  };
});

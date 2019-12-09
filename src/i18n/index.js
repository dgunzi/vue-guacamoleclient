import VueI18n from 'vue-i18n'
import Vue from 'vue'
import cz from './translations/cz.json';
import de from './translations/de.json';
import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';
import it from './translations/it.json';
import ja from './translations/ja.json';
import nl from './translations/nl.json';
import no from './translations/no.json';
import ru from './translations/ru.json';
import zh from './translations/zh.json';

Vue.use(VueI18n)

let locales = {
    de: getFullData(de),
    cz: getFullData(cz),
    en: en,
    es: getFullData(es),
    fr: getFullData(fr),
    it: getFullData(it),
    ja: getFullData(ja),
    nl: getFullData(nl),
    no: getFullData(no),
    ru: getFullData(ru),
    zh: getFullData(zh)
};

// 并不是所有文件都采用了完整的翻译
function getFullData(item) {
    let temp = JSON.parse(JSON.stringify(en));
    for (const key in temp) {
        if (typeof temp[key] !== 'string') {
            item[key] = Object.assign(temp[key], item[key]);
        }
    }
    return item;
}

const i18n = new VueI18n({
    locale: 'zh', // 设置语言环境
    messages: locales,
    fallbackRoot: 'en'
});

export default i18n;
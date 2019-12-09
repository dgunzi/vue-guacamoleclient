function PageDefinition(template) {
    /**
     * The the name of the page, which should be a translation table key.
     * Alternatively, this may also be a list of names, where the final
     * name represents the page and earlier names represent categorization.
     * Those categorical names may be rendered hierarchically as a system
     * of menus, tabs, etc.
     *
     * @type String|String[]
     */
    this.name = template.name;

    /**
     * The URL of the page.
     *
     * @type String
     */
    this.url = template.url;

    /**
     * The CSS class name to associate with this page, if any. This will be
     * an empty string by default.
     * 要与此页面关联的CSS类名(如果有的话)。这将是一个默认的空字符串。
     * @type String
     */
    this.className = template.className || '';

    /**
     * A numeric value denoting the relative sort order when compared to
     * other sibling PageDefinitions. If unspecified, sort order is
     * determined by the system using the PageDefinition.
     * 一个数字值，表示与其他同级页面定义比较时的相对排序顺序。如果未指定，排序顺序由系统使用PageDefinition确定。
     * @type Number
     */
    this.weight = template.weight;
};

export default PageDefinition;
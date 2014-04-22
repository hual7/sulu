define(["app-config"],function(a){"use strict";var b="contentLanguage";return{view:!0,templates:["/admin/content/template/content/settings"],ws:null,wsUrl:"",wsPort:"",previewInitiated:!1,opened:!1,template:"",templateChanged:!1,contentChanged:!1,hiddenTemplate:!0,propertyConfiguration:null,initialize:function(){this.sandbox.emit("sulu.app.ui.reset",{navigation:"small",content:"auto"}),this.propertyConfiguration={},this.saved=!0,this.highlightSaveButton=this.sandbox.sulu.viewStates.justSaved,delete this.sandbox.sulu.viewStates.justSaved,this.state=null,this.dfdListenForChange=this.sandbox.data.deferred(),this.formId="#contacts-form-container",this.render(),this.setHeaderBar(!0)},render:function(){this.bindCustomEvents(),this.options.tab.content===!0?this.renderContent():this.options.tab.settings===!0&&this.renderSettings()},renderContent:function(){this.options.data.template?this.changeTemplate(this.options.data.template):this.changeTemplate()},showStateDropdown:function(){this.sandbox.emit("sulu.header.toolbar.item.enable","state",!1)},renderSettings:function(){this.setHeaderBar(!1),this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/content/template/content/settings")),this.createForm(this.initData()),this.bindDomEvents(),this.listenForChange(),this.setStateDropdown(this.options.data),this.showStateDropdown(),this.template=""!==this.template?this.template:this.options.data.template,this.changeTemplateDropdownHandler()},setStateDropdown:function(a){this.state=a.nodeState||0,this.sandbox.emit("sulu.content.contents.getDropdownForState",this.state,function(a){a.length>0&&this.sandbox.emit("sulu.header.toolbar.items.set","state",a)}.bind(this)),this.sandbox.emit("sulu.content.contents.getStateDropdownItem",this.state,function(a){this.sandbox.emit("sulu.header.toolbar.button.set","state",a)}.bind(this))},setTitle:function(){var a=this.propertyConfiguration["sulu.node.name"].highestProperty.$el.data("element").getValue();this.options.id&&""!==a?(this.sandbox.emit("sulu.content.set-title",a),this.setBreadcrumb()):this.sandbox.emit("sulu.header.set-title",this.sandbox.translate("content.contents.title"))},setBreadcrumb:function(){if(this.options.data.breadcrumb){var a,b,c=[{title:this.options.webspace.replace(/_/g,"."),event:"sulu.content.contents.list"}];for(b=0,a=this.options.data.breadcrumb.length;++b<a;)c.push({title:this.options.data.breadcrumb[b].title,link:this.getBreadcrumbRoute(this.options.data.breadcrumb[b].uuid)});this.sandbox.emit("sulu.header.set-breadcrumb",c)}},getBreadcrumbRoute:function(a){return this.sandbox.mvc.history.fragment.replace(this.options.id,a)},createForm:function(a){var b=this.sandbox.form.create(this.formId),c=this.sandbox.data.deferred();return b.initialized.then(function(){this.createConfiguration(this.formId),c.resolve(),this.setFormData(a).then(function(){this.sandbox.start(this.$el,{reset:!0}),this.initSortableBlock(),this.bindFormEvents(),this.options.preview&&(this.initPreview(),this.options.preview=!1)}.bind(this))}.bind(this)),c.promise()},createConfiguration:function(a){var b=this.sandbox.dom.find("*[data-property]",a);this.sandbox.dom.each(b,function(a,b){var c=this.sandbox.dom.data(b,"property");c.$el=this.sandbox.dom.$(b),$(b).data("property",null),$(b).removeAttr("data-property",null),this.sandbox.util.foreach(c.tags,function(a){this.propertyConfiguration[a.name]?(this.propertyConfiguration[a.name].properties[a.priority]?this.propertyConfiguration[a.name].properties[a.priority].push(c):this.propertyConfiguration[a.name].properties[a.priority]=[c],this.propertyConfiguration[a.name].highestPriority<a.priority&&(this.propertyConfiguration[a.name].highestProperty=c,this.propertyConfiguration[a.name].highestPriority=a.priority),this.propertyConfiguration[a.name].lowestPriority>a.priority&&(this.propertyConfiguration[a.name].lowestProperty=c,this.propertyConfiguration[a.name].lowestPriority=a.priority)):(this.propertyConfiguration[a.name]={properties:{},highestProperty:c,highestPriority:a.priority,lowestProperty:c,lowestPriority:a.priority},this.propertyConfiguration[a.name].properties[a.priority]=[c])}.bind(this))}.bind(this))},initSortableBlock:function(){var a,b=this.sandbox.dom.find(".sortable",this.$el);b&&b.length>0&&(this.sandbox.dom.sortable(b,"destroy"),a=this.sandbox.dom.sortable(b,{handle:".move",forcePlaceholderSize:!0}),this.sandbox.dom.unbind(a,"sortupdate"),a.bind("sortupdate",function(a){var b=this.sandbox.form.getData(this.formId),c=this.sandbox.dom.data(a.currentTarget,"mapperProperty");this.updatePreview(c,b[c])}.bind(this)))},bindFormEvents:function(){this.sandbox.dom.on(this.formId,"form-collection-init",function(){this.updatePreview()}.bind(this)),this.sandbox.dom.on(this.formId,"form-remove",function(a,b){var c=this.sandbox.form.getData(this.formId);this.initSortableBlock(),this.updatePreview(b,c[b]),this.setHeaderBar(!1)}.bind(this)),this.sandbox.dom.on(this.formId,"form-add",function(a,b){this.createConfiguration(a.currentTarget),this.sandbox.start($(a.currentTarget));var c=this.sandbox.form.getData(this.formId);this.initSortableBlock(),this.updatePreview(b,c[b])}.bind(this))},setFormData:function(a){var b=this.sandbox.form.setData(this.formId,a);return!a.id||""!==a.title&&"undefined"!=typeof a.title&&null!==a.title||this.sandbox.util.load("/admin/api/nodes/"+a.id+"?webspace="+this.options.webspace+"&language="+this.options.language+"&complete=false&ghost-content=true").then(function(a){this.sandbox.dom.attr("#title","placeholder",a.type.value+": "+a.title)}.bind(this)),"index"===this.options.id&&this.sandbox.dom.remove("#show-in-navigation-container"),this.sandbox.dom.attr("#show-in-navigation","checked",a.navigation),this.setTitle(),b},getDomElementsForTagName:function(a,b){var c,d=$();if(this.propertyConfiguration.hasOwnProperty(a))for(c in this.propertyConfiguration[a].properties)this.propertyConfiguration[a].properties.hasOwnProperty(c)&&this.sandbox.util.foreach(this.propertyConfiguration[a].properties[c],function(a){$.merge(d,a.$el),b&&b(a)});return d},bindDomEvents:function(){var a=!1;this.getDomElementsForTagName("sulu.rlp.input",function(b){""===b.$el.data("element").getValue()&&(a=!0)}.bind(this)),a?this.sandbox.dom.one(this.getDomElementsForTagName("sulu.rlp.part"),"focusout",this.setResourceLocator.bind(this)):this.dfdListenForChange.resolve()},setResourceLocator:function(){var a={},b=!0;this.getDomElementsForTagName("sulu.rlp.part",function(c){var d=c.$el.data("element").getValue();""!==d?a[c.$el.data("mapperProperty")]=d:b=!1}.bind(this)),b?this.sandbox.emit("sulu.content.contents.getRL",a,this.template,function(a){this.getDomElementsForTagName("sulu.rlp.input",function(b){""===b.$el.data("element").getValue()&&b.$el.data("element").setValue(a)}.bind(this)),this.dfdListenForChange.resolve(),this.setHeaderBar(!1),this.contentChanged=!0}.bind(this)):this.sandbox.dom.one(this.getDomElementsForTagName("sulu.rlp.part"),"focusout",this.setResourceLocator.bind(this))},bindCustomEvents:function(){this.sandbox.on("sulu.content.contents.saved",function(){this.highlightSaveButton=!0,this.setHeaderBar(!0),this.setTitle()},this),this.sandbox.on("sulu.header.toolbar.save",function(){this.submit()},this),this.sandbox.on("sulu.preview.save",function(){this.submit()},this),this.sandbox.on("sulu.preview.delete",function(){this.sandbox.emit("sulu.content.content.delete",this.options.data.id)},this),this.sandbox.on("sulu.header.toolbar.delete",function(){this.sandbox.emit("sulu.content.content.delete",this.options.data.id)},this),this.sandbox.on("sulu.preview.set-params",function(a,b){this.wsUrl=a,this.wsPort=b},this),this.sandbox.on("sulu.content.contents.default-template",function(a){this.template=a,this.sandbox.emit("sulu.header.toolbar.item.change","template",a),this.hiddenTemplate&&(this.hiddenTemplate=!1,this.sandbox.emit("sulu.header.toolbar.item.show","template",a))},this),this.sandbox.on("sulu.dropdown.template.item-clicked",function(a){this.sandbox.emit("sulu.header.toolbar.item.loading","template"),this.templateChanged=!0,this.changeTemplate(a)},this),this.sandbox.on("sulu.header.toolbar.language-changed",function(a){this.sandbox.sulu.saveUserSetting(b,a.localization),this.sandbox.emit("sulu.content.contents.load",this.options.id,this.options.webspace,a.localization)},this),this.sandbox.on("sulu.content.contents.state.change",function(){this.sandbox.emit("sulu.header.toolbar.item.loading","state")},this),this.sandbox.on("sulu.content.contents.save",function(){this.sandbox.emit("sulu.header.toolbar.item.loading","save-button")},this),this.sandbox.on("sulu.content.contents.state.changed",function(a){this.state=a,this.sandbox.emit("sulu.content.contents.getDropdownForState",this.state,function(a){this.sandbox.emit("sulu.header.toolbar.items.set","state",a,null)}.bind(this)),this.sandbox.emit("sulu.content.contents.getStateDropdownItem",this.state,function(a){this.sandbox.emit("sulu.header.toolbar.button.set","state",a)}.bind(this)),this.sandbox.emit("sulu.header.toolbar.item.enable","state",!0)}.bind(this)),this.sandbox.on("sulu.content.contents.state.changeFailed",function(){this.sandbox.emit("sulu.content.contents.getStateDropdownItem",this.state,function(a){this.sandbox.emit("sulu.header.toolbar.button.set","state",a)}.bind(this)),this.sandbox.emit("sulu.header.toolbar.item.enable","state",!1)}.bind(this)),this.sandbox.on("husky.navigation.item.select",function(a){a.id!==this.options.id&&this.sandbox.emit("sulu.app.ui.reset",{navigation:"auto",content:"auto"})}.bind(this)),this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.content.contents.list")}.bind(this))},initData:function(){return this.options.data},submit:function(){this.sandbox.logger.log("save Model");var a,b=""!==this.template?this.template:this.options.data.template;this.sandbox.form.validate(this.formId)&&(a=this.sandbox.form.getData(this.formId),"index"===this.options.id?a.navigation=!0:this.sandbox.dom.find("#show-in-navigation",this.$el).length&&(a.navigation=this.sandbox.dom.prop("#show-in-navigation","checked")),this.sandbox.logger.log("data",a),this.options.data=this.sandbox.util.extend(!0,{},this.options.data,a),this.sandbox.emit("sulu.content.contents.save",a,b))},changeTemplateDropdownHandler:function(){this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template),this.sandbox.emit("sulu.header.toolbar.item.enable","template",this.templateChanged),this.hiddenTemplate&&(this.hiddenTemplate=!1,this.sandbox.emit("sulu.header.toolbar.item.show","template"))},changeTemplate:function(a){if("string"==typeof a&&(a={template:a}),a&&this.template===a.template)return void this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1);var b=function(){a&&(this.template=a.template),this.setHeaderBar(!1);var b,c;this.sandbox.form.getObject(this.formId)&&(b=this.options.data,this.options.data=this.sandbox.form.getData(this.formId),b.id&&(this.options.data.id=b.id),this.options.data=this.sandbox.util.extend({},b,this.options.data)),this.writeStartMessage(),a&&this.sandbox.emit("sulu.content.preview.change-url",{template:a.template}),this.options.tab.content===!0?(c="text!/admin/content/template/form",c+=a?"/"+a.template+".html":".html",c+="?webspace="+this.options.webspace+"&language="+this.options.language,require([c],function(a){var b={translate:this.sandbox.translate},c=this.sandbox.util.extend({},b),d=this.sandbox.util.template(a,c),e=this.initData();this.sandbox.dom.remove(this.formId+" *"),this.sandbox.dom.html(this.$el,d),this.setStateDropdown(e),this.propertyConfiguration={},this.createForm(e).then(function(){this.bindDomEvents(),this.listenForChange(),this.updatePreviewOnly(),this.changeTemplateDropdownHandler()}.bind(this))}.bind(this))):this.changeTemplateDropdownHandler()}.bind(this),c=function(){this.sandbox.emit("sulu.dialog.confirmation.show",{content:{title:this.sandbox.translate("content.template.dialog.title"),content:this.sandbox.translate("content.template.dialog.content")},footer:{buttonCancelText:this.sandbox.translate("content.template.dialog.cancel-button"),buttonSubmitText:this.sandbox.translate("content.template.dialog.submit-button")},callback:{submit:function(){this.sandbox.emit("husky.dialog.hide"),b()}.bind(this),cancel:function(){this.sandbox.emit("husky.dialog.hide")}.bind(this)}},null)}.bind(this);""!==this.template&&this.contentChanged?c():b()},setHeaderBar:function(a){if(a!==this.saved){var b=this.options.data&&this.options.data.id?"edit":"add";this.sandbox.emit("sulu.header.toolbar.state.change",b,a,this.highlightSaveButton),this.sandbox.emit("sulu.preview.state.change",a)}this.saved=a,this.saved&&(this.contentChanged=!1,this.highlightSaveButton=!1)},listenForChange:function(){this.dfdListenForChange.then(function(){this.sandbox.dom.on(this.formId,"keyup",function(){this.setHeaderBar(!1),this.contentChanged=!0}.bind(this),".trigger-save-button"),this.sandbox.dom.on(this.formId,"change",function(){this.setHeaderBar(!1),this.contentChanged=!0}.bind(this),".trigger-save-button"),this.sandbox.on("sulu.content.changed",function(){this.setHeaderBar(!1),this.contentChanged=!0}.bind(this))}.bind(this))},wsDetection:function(){var a="MozWebSocket"in window?"MozWebSocket":"WebSocket"in window?"WebSocket":null;return null===a?(this.sandbox.logger.log("Your browser doesn't support Websockets."),!1):(window.MozWebSocket&&(window.WebSocket=window.MozWebSocket),!0)},initPreview:function(){this.wsDetection()?this.initWs():this.initAjax(),this.previewInitiated=!0,this.sandbox.on("sulu.preview.update",function(a,b,c){if(this.options.data.id){var d=this.getSequence(a);null!==this.ws?this.updatePreview(d,b):c||this.updatePreview(d,b)}},this)},getSequence:function(a){a=$(a);for(var b=this.sandbox.dom.data(a,"mapperProperty"),c=a.parents("*[data-mapper-property]"),d=a.parents("*[data-mapper-property-tpl]")[0];!a.data("element");)a=a.parent();return c.length>0&&(b=[this.sandbox.dom.data(c[0],"mapperProperty")[0].data,$(d).index(),this.sandbox.dom.data(a,"mapperProperty")]),b},updateEvent:function(a){if(this.options.data.id&&this.previewInitiated){var b=$(a.currentTarget),c=this.sandbox.dom.data(b,"element");this.updatePreview(this.getSequence(b),c.getValue())}},initAjax:function(){this.sandbox.dom.on(this.formId,"focusout",this.updateEvent.bind(this),".preview-update");var a=this.sandbox.form.getData(this.formId);this.updateAjax(a)},initWs:function(){var a=this.wsUrl+":"+this.wsPort;this.sandbox.logger.log("Connect to url: "+a),this.ws=new WebSocket(a),this.ws.onopen=function(){this.sandbox.logger.log("Connection established!"),this.opened=!0,this.sandbox.dom.on(this.formId,"keyup",this.updateEvent.bind(this),".preview-update"),this.writeStartMessage()}.bind(this),this.ws.onclose=function(){this.opened||(this.ws=null,this.initAjax())}.bind(this),this.ws.onmessage=function(a){var b=JSON.parse(a.data);"start"===b.command&&b.content===this.options.id&&b.params.other&&this.updatePreview(),this.sandbox.logger.log("Message:",b)}.bind(this),this.ws.onerror=function(a){this.sandbox.logger.warn(a),this.ws=null,this.initAjax()}.bind(this)},writeStartMessage:function(){if(null!==this.ws){var b={command:"start",content:this.options.data.id,type:"form",user:a.getUser().id,webspaceKey:this.options.webspace,languageCode:this.options.language,templateKey:this.template,params:{}};this.ws.send(JSON.stringify(b))}},updatePreview:function(a,b){if(this.previewInitiated){var c={};a&&b?c[a]=b:c=this.sandbox.form.getData(this.formId),null!==this.ws?this.updateWs(c):this.updateAjax(c)}},updatePreviewOnly:function(){if(this.previewInitiated){var a={};null!==this.ws?this.updateWs(a):this.updateAjax(a)}},updateAjax:function(a){var b="/admin/content/preview/"+this.options.data.id+"?template="+this.template+"&webspace="+this.options.webspace+"&language="+this.options.language;this.sandbox.util.ajax({url:b,type:"POST",data:{changes:a}})},updateWs:function(b){if(null!==this.ws&&this.ws.readyState===this.ws.OPEN){var c={command:"update",content:this.options.data.id,type:"form",user:a.getUser().id,webspaceKey:this.options.webspace,languageCode:this.options.language,templateKey:this.template,params:{changes:b}};this.ws.send(JSON.stringify(c))}}}});
import{u as l,r as h}from"./index-WV522OtY.js";const s="KHR_node_hoverability";class _{constructor(e){this.name=s,this._loader=e,this.enabled=e.isExtensionUsed(s)}async onReady(){var e;(e=this._loader.gltf.nodes)==null||e.forEach(o=>{var t,n,r;(t=o.extensions)!=null&&t.KHR_node_hoverability&&((n=o.extensions)==null?void 0:n.KHR_node_hoverability.hoverable)===!1&&((r=o._babylonTransformNode)==null||r.getChildMeshes().forEach(a=>{a.pointerOverDisableMeshTesting=!0}))})}dispose(){this._loader=null}}l(s);h(s,!0,i=>new _(i));export{_ as KHR_node_hoverability};

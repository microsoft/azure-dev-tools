import { createRequire as __canvasCreateRequire } from "node:module";
const require = __canvasCreateRequire(import.meta.url);
import{readFileSync}from"node:fs";var TIER_IDS=Object.freeze(["web","agent","gateway","skills","sandbox","connectors","workflows","sre","data"]),PLATFORM_TIERS=Object.freeze([{id:"web",name:"Surface / web",role:"Human-facing application surface",jobToBeDone:"Present application state and turn user intent into governed requests.",expectedInterfaces:["HTTP","WebSocket or server events","Accessible UI"],preferredCanvases:["app-service-builder"],scaffold:{summary:"Create a web surface with App Service Builder that serves static or HTTP components and calls governed APIs.",markers:["package.json","builder.yaml"],nextActions:["Choose a web runtime","Define the builder.yaml component contract","Add health and telemetry endpoints"]}},{id:"agent",name:"Agent",mapLabel:"Agent",role:"Agent reasoning and tool use governed by an agent harness",jobToBeDone:"Reason over user intent and use governed tools without fabricating results.",expectedInterfaces:["HTTP or Responses API","Agent instructions","Tool contracts","Runtime configuration"],preferredCanvases:["ai-gateway-studio","agent-builder"],scaffold:{summary:"Create an agent with explicit instructions, tool contracts, and a selected harness and hosting runtime.",markers:["agent.yaml","main.py"],nextActions:["Choose the agent runtime and hosting","Define agent instructions","Register tools and model routing"]}},{id:"gateway",name:"Gateway",role:"Governed model and tool ingress (protects shared tools & models across 1 to 2+ agents)",jobToBeDone:"Route all model and tool calls\u2014including sandboxed tools and Hosted Skills\u2014through one governed seam for auth, quotas, routing, and audit.",expectedInterfaces:["OpenAI-compatible API","MCP federation","Policy telemetry"],preferredCanvases:["ai-gateway-studio"],scaffold:{summary:"Provision or bind an API Management AI Gateway in front of shared models, sandboxed tools, and MCP endpoints.",markers:["azure.yaml","infra"],nextActions:["Select an APIM instance","Define model and tool routes","Apply token and identity policies"]}},{id:"skills",name:"Hosted Skills",role:"Deterministic, callable business capabilities",jobToBeDone:"Expose bounded operations as independently deployable tools with explicit contracts.",expectedInterfaces:["MCP","HTTP","Function trigger"],preferredCanvases:["intelligent-function-app-studio"],scaffold:{summary:"Create a hosted skill with a function entry point, tool contract, and MCP endpoint.",markers:["agents.config.yaml","function_app.py","host.json"],nextActions:["Define one bounded capability","Declare its input/output contract","Add local and hosted tests"]}},{id:"sandbox",name:"Sandbox",role:"Ephemeral isolated execution with Sandboxes egress proxy",jobToBeDone:"Run sensitive or untrusted computation in ACA Sandboxes with default-deny egress proxy protection; put behind AI Gateway when shared by 2+ agents.",expectedInterfaces:["Job API","Container image","Egress policy"],preferredCanvases:[],scaffold:{summary:"Create an ephemeral containerized job with Sandboxes egress proxy policy, explicit ingress, identity, and deletion behavior.",markers:["Dockerfile","egress-policy.yaml"],nextActions:["Define the isolation boundary","Build the container image","Set egress policy and lifecycle policy"]}},{id:"connectors",name:"Connectors",role:"External system integration",jobToBeDone:"Connect applications to collaboration and systems-of-record APIs through governed identities.",expectedInterfaces:["Connector API","Microsoft Graph","Event or webhook"],preferredCanvases:[],scaffold:{summary:"Define a connector boundary with least-privilege identity and an explicit external API contract.",markers:["connector manifest","connection configuration"],nextActions:["Choose the external system","Define least-privilege permissions","Add retry and audit behavior"]}},{id:"workflows",name:"Durable workflows",role:"Replay-safe long-running coordination",jobToBeDone:"Coordinate activities, timers, events, and human decisions across process restarts.",expectedInterfaces:["Orchestration trigger","Activity trigger","External event"],preferredCanvases:["intelligent-function-app-studio"],scaffold:{summary:"Create a durable orchestration with replay-safe activities, timers, and external-event handling.",markers:["function_app.py","host.json"],nextActions:["Model the orchestration states","Separate deterministic orchestration from activities","Test replay and resume"]}},{id:"sre",name:"Self-awareness / SRE",role:"Cross-tier observation, diagnosis, and safe remediation",jobToBeDone:"Correlate signals across the application and propose or perform policy-bounded remediation.",expectedInterfaces:["Telemetry","Health model","Incident and remediation workflow"],preferredCanvases:["sre-agent-studio"],scaffold:{summary:"Connect cross-tier telemetry to a health model and define approval-bounded remediation workflows.",markers:["sre-agent configuration","health model","OpenTelemetry configuration"],nextActions:["Define health entities","Connect logs, metrics, and traces","Set remediation approval policy"]}},{id:"data",name:"Direct data primitive",role:"Durable application state and retrieval",jobToBeDone:"Store, query, and govern operational, analytical, and grounding data.",expectedInterfaces:["Data API","Schema","Backup and retention policy"],preferredCanvases:[],scaffold:{summary:"Choose a data service from access, consistency, retention, and governance requirements.",markers:["schema","migration","data resource definition"],nextActions:["Define the data contract","Choose the persistence model","Add lifecycle and recovery controls"]}}].map(tier=>Object.freeze({...tier,expectedInterfaces:Object.freeze([...tier.expectedInterfaces]),preferredCanvases:Object.freeze([...tier.preferredCanvases]),scaffold:Object.freeze({...tier.scaffold,markers:Object.freeze([...tier.scaffold.markers]),nextActions:Object.freeze([...tier.scaffold.nextActions])})})));function mountStudioHeader(element,{toolkit,utilities,onHome}){let{createElement:h,mountCanvasComponent,CanvasHeader,useRef,useEffect}=toolkit;function Utilities(){let ref=useRef(null);return useEffect(()=>(ref.current.append(utilities),()=>utilities.remove()),[]),h("div",{ref})}return mountCanvasComponent(element,()=>h(CanvasHeader,{title:"Azure App Platform",onHome,homeButton:{"aria-label":"App home",style:{fontWeight:400}},icon:h("img",{src:"/assets/app-platform-symbol.png",width:20,height:20,alt:"","aria-hidden":!0,style:{display:"block",objectFit:"contain"}}),actions:h(Utilities)}))}function renderStudioIntroStyles(){return`
    .studio-intro, .studio-intro::backdrop {
      --studio-intro-bg: #000000; --studio-intro-ink: #edf0f5;
      --studio-intro-button: #20232b; --studio-intro-line: #454b57;
      color-scheme: dark; background: var(--studio-intro-bg);
    }
    .studio-intro {
      position: fixed; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none;
      margin: 0; padding: 0; border: 0; color: var(--studio-intro-ink);
    }
    .studio-intro video { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; }
    .studio-intro button {
      position: absolute; right: 16px; bottom: 16px; min-height: 32px; padding: 6px 12px;
      border: 1px solid var(--studio-intro-line); border-radius: 6px; font-size: 12px; line-height: 18px;
      background: var(--studio-intro-button); color: var(--studio-intro-ink);
    }
    .studio-intro button:hover { border-color: var(--studio-intro-ink); }
    .studio-intro button:focus-visible { outline: 2px solid var(--studio-intro-ink); outline-offset: 3px; }
    .studio-intro-notice { padding: 10px 12px; margin-bottom: 16px; border: 1px solid var(--studio-line); border-radius: 10px; color: var(--studio-muted); }
    .studio-intro-notice:empty { display: none; }
  `}function renderStudioIntro(){return`<dialog class="studio-intro" aria-label="Welcome to Azure App Platform">
    <video muted playsinline preload="none" aria-label="Azure App Platform logo animation"></video>
    <button type="button" id="skip-studio-intro" autofocus>Skip</button>
  </dialog>`}function renderStudioIntroClientScript(){return`
    (() => {
      const dialog = document.querySelector(".studio-intro");
      if (!dialog) return;
      // Consume the launch marker so reload and Home do not replay the intro.
      const location = new URL(window.location.href);
      location.searchParams.delete("intro");
      history.replaceState(history.state, "", location);
      const motion = matchMedia("(prefers-reduced-motion: reduce)");
      if (motion.matches) { dialog.remove(); return; }
      const video = dialog.querySelector("video");
      const previousFocus = document.activeElement;
      const listeners = new AbortController();
      const options = { signal: listeners.signal };
      let finished = false;
      let stallTimer;
      let deadline;
      const finish = (warning = "") => {
        if (finished) return;
        finished = true;
        clearTimeout(stallTimer);
        clearTimeout(deadline);
        listeners.abort();
        video.pause();
        video.removeAttribute("src");
        video.load();
        dialog.close();
        dialog.remove();
        if (warning) {
          console.warn(warning);
          document.querySelector(".studio-intro-notice").textContent = warning;
        }
        if (previousFocus?.isConnected && previousFocus !== document.body) {
          previousFocus.focus({ preventScroll: true });
        }
      };
      const stalled = () => finish("The intro took too long to play. You can continue below.");
      const resetStallTimer = () => {
        clearTimeout(stallTimer);
        stallTimer = setTimeout(stalled, 5000);
      };
      dialog.querySelector("button").addEventListener("click", () => finish(), options);
      dialog.addEventListener("cancel", (event) => { event.preventDefault(); finish(); }, options);
      video.addEventListener("ended", () => finish(), options);
      video.addEventListener("error", () => finish("The intro could not be loaded. You can continue below."), options);
      let lastTime = 0;
      video.addEventListener("timeupdate", () => {
        if (video.currentTime > lastTime) { lastTime = video.currentTime; resetStallTimer(); }
      }, options);
      motion.addEventListener("change", (event) => { if (event.matches) finish(); }, options);
      dialog.showModal();
      dialog.querySelector("button").focus();
      video.muted = true;
      video.src = "/assets/app-platform-intro.mp4";
      resetStallTimer();
      deadline = setTimeout(stalled, 18000);
      video.play().catch(() => finish("Your browser could not play the intro automatically. You can continue below."));
    })();
  `}import{randomUUID}from"node:crypto";import{mkdir,readFile,rename,unlink,writeFile}from"node:fs/promises";import{homedir}from"node:os";import{join}from"node:path";var SETTINGS_CSS=`
  .studio-utilities-toggle { width:32px; height:32px; }
  .studio-settings { box-sizing:border-box; position:fixed; inset:0; margin:0; width:100%; height:100dvh; max-width:none; max-height:none; padding:0; border:0; border-radius:0; color:var(--studio-ink); background:var(--studio-raised); font:13px/1.5 var(--font-sans, system-ui, sans-serif); overflow:hidden; }
  .studio-settings[open] { display:flex; flex-direction:column; }
  .studio-settings::backdrop { background:rgb(0 0 0 / .4); }
  .studio-settings-heading { flex:none; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 20px; border-bottom:1px solid var(--studio-line); background:var(--studio-raised); }
  .studio-settings h2 { margin:0; font-size:18px; color:var(--studio-ink); }
  .studio-settings-close { display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; min-height:32px; padding:4px; border:0; background:transparent; color:var(--studio-muted); border-radius:6px; }
  .studio-settings-close:hover { background:var(--studio-panel); }
  .studio-settings-layout { display:grid; grid-template-columns:184px minmax(0, 1fr); min-height:0; flex:1; }
  .studio-settings-navigation { display:flex; flex-direction:column; gap:6px; min-width:0; overflow:auto; padding:20px 12px; border-right:1px solid var(--studio-line); background:var(--studio-panel); }
  .studio-settings .studio-settings-scope { margin:0 0 8px; font-size:11px; font-weight:600; }
  .studio-settings .studio-settings-app-name { margin:18px 0 6px; padding-top:16px; border-top:1px solid var(--studio-line); }
  .studio-settings .studio-settings-navigation button { width:100%; justify-content:flex-start; text-align:left; height:auto; min-height:36px; border-color:transparent; background:transparent; font-weight:400; }
  .studio-settings .studio-settings-navigation button[aria-current="page"] { color:var(--studio-ink); background:var(--studio-raised); border-color:var(--studio-line); box-shadow:inset 3px 0 var(--studio-accent); font-weight:600; }
  .studio-settings-compact-navigation { display:none !important; }
  .studio-settings-content { overflow:auto; overscroll-behavior:contain; min-width:0; min-height:0; padding:24px; scrollbar-gutter:stable; }
  .studio-settings-section { max-width:680px; margin:0 auto; min-width:0; }
  .studio-settings-section[hidden] { display:none !important; }
  .studio-settings-section > h3 { margin:0 0 20px; font-size:18px; }
  .studio-settings label, .studio-settings .studio-field { display:grid; gap:6px; min-width:0; color:var(--studio-ink); font-size:12px; font-weight:600; }
  .studio-settings select { box-sizing:border-box; width:100%; min-width:0; max-width:100%; min-height:34px; padding:6px 10px; border:1px solid var(--studio-line); border-radius:6px; color:var(--studio-ink); background:var(--studio-raised); font:13px/1.5 system-ui; }
  .studio-settings p { color:var(--studio-muted); font-size:12px; line-height:1.5; margin:8px 0; overflow-wrap:anywhere; }
  .studio-settings .studio-editor-preference { margin-top:16px; }
  .studio-settings-section > [data-settings-body] { display:grid; gap:14px; min-width:0; }
  .studio-settings-section [data-settings-body] h3 { font-size:14px; margin:0; color:var(--studio-ink); }
  .studio-settings .gateway-fields { display:grid; gap:14px; min-width:0; }
  .studio-settings .field-group { display:grid; gap:8px; min-width:0; }
  .studio-settings .field-actions { display:flex; flex-wrap:wrap; align-items:center; gap:8px; }
  .studio-settings .actions { display:flex; flex-wrap:wrap; gap:8px; margin:0; }
  .studio-settings button:not(.studio-settings-close, .ct-button, .ct-combobox) { width:fit-content; max-width:100%; min-height:32px; padding:6px 10px; border:1px solid var(--studio-line); border-radius:6px; background:var(--studio-raised); color:var(--studio-ink); font:600 12px/1.4 system-ui; white-space:normal; cursor:pointer; }
  .studio-settings button:hover:not(:disabled) { border-color:var(--studio-accent); }
  .studio-settings button.primary { background:var(--studio-accent); border-color:var(--studio-accent); color:var(--studio-on-accent); }
  .studio-settings button.danger, .studio-settings .error { color:var(--studio-danger); }
  .studio-settings button.danger { border-color:var(--studio-danger); }
  .studio-settings button:disabled { opacity:.6; cursor:not-allowed; }
  .studio-settings :is(button, select, summary):focus-visible { outline:2px solid var(--studio-focus); outline-offset:2px; }
  .studio-settings .studio-settings-error:empty { display:none; }
  .studio-settings [data-settings-section="danger"] > h3 { color:var(--studio-danger); }
  @media (max-width:480px), (max-height:480px) {
    .studio-settings-heading { padding:10px 16px; }
    .studio-settings-layout { grid-template-columns:minmax(0, 1fr); grid-template-rows:auto minmax(0, 1fr); }
    .studio-settings-navigation { display:none; }
    .studio-settings .studio-settings-compact-navigation { display:grid !important; padding:12px 16px; border-bottom:1px solid var(--studio-line); background:var(--studio-panel); }
    .studio-settings-content { padding:20px 16px; }
  }
`;function createEditorPreference({select,errorDisplay,globalError,dialog,initialSettings,request,onChange}){function validate(settings){if(!Array.isArray(settings?.editors)||!settings.editors.length||settings.editors.some(editor=>typeof editor?.id!="string"||typeof editor.label!="string")||new Set(settings.editors.map(editor=>editor.id)).size!==settings.editors.length||!settings.editors.some(editor=>editor.id===settings.editorId))throw new Error("Studio returned an invalid editor preference.");return settings}let confirmed=validate(initialSettings),current=confirmed,busy=!1;function report(message){errorDisplay.textContent=message,globalError.textContent=dialog.open?"":message}function render(notify=!0){select.replaceChildren();for(let editor of current.editors){let option=document.createElement("option");option.value=editor.id,option.textContent=editor.label,select.append(option)}select.value=current.editorId,select.disabled=busy,notify&&onChange({settings:current,busy})}let api={async refresh({silentNetworkError=!1}={}){if(!(busy||window.__appPlatformSubmitting)){busy=!0,report(""),render();try{current=confirmed=validate(await request("/api/editor-settings"))}catch(error){current=confirmed;let isTransientFetchAbort=silentNetworkError&&(error?.name==="AbortError"||/Load failed|Failed to fetch|NetworkError/i.test(String(error?.message||"")));!window.__appPlatformSubmitting&&!isTransientFetchAbort&&report("Could not load editor preference: "+error.message)}finally{busy=!1,render()}}},async save(editorId){if(busy){let error="Wait for the current editor preference request to finish.";return report(error),{ok:!1,error}}if(!confirmed.editors.some(editor=>editor.id===editorId)){let error="Choose a supported external editor.";return report(error),{ok:!1,error}}if(editorId===confirmed.editorId)return{ok:!0,settings:confirmed};busy=!0,current={...confirmed,editorId},report(""),render();try{return current=confirmed=validate(await request("/api/editor-settings",{method:"POST",body:JSON.stringify({editorId})})),{ok:!0,settings:confirmed}}catch(cause){current=confirmed;let error="Could not save editor preference: "+cause.message;return report(error),{ok:!1,error}}finally{busy=!1,render()}}};return select.addEventListener("change",()=>{api.save(select.value)}),render(!1),api}function createStudioSettings({dialog,trigger,onOpen,onClear=()=>{}}){let app,returnFocus,selected="preferences",sections=new Map,content=dialog.querySelector("[data-settings-app]"),navigation=dialog.querySelector("[data-settings-app-navigation]"),picker=dialog.querySelector("[data-settings-navigation]"),scroller=dialog.querySelector(".studio-settings-content"),preferences=dialog.querySelector('[data-settings-section="preferences"]'),generalButton=dialog.querySelector('[data-settings-target="preferences"]');sections.set("preferences",{element:preferences,button:generalButton});function render(section){let entry=sections.get(section);if(!entry?.body||!app)return;let active=document.activeElement,focused=entry.body.contains(active),label=active?.getAttribute("aria-label"),text=active?.textContent;onClear(entry.body),entry.body.replaceChildren(),app.renderSection(section,entry.body),entry.dirty=!1,entry.loaded=!0,focused&&([...entry.body.querySelectorAll("button, select, input")].find(node=>!node.disabled&&(label?node.getAttribute("aria-label")===label:node.textContent===text))||(picker.getClientRects().length?picker:entry.button)).focus({preventScroll:!0})}function select(section){let target=sections.has(section)?section:"preferences",previous=sections.get(selected);previous&&(previous.scrollTop=scroller.scrollTop),selected=target,picker.value=target;for(let[id,entry2]of sections)entry2.element.hidden=id!==target,id===target?entry2.button.setAttribute("aria-current","page"):entry2.button.removeAttribute("aria-current");let entry=sections.get(target);entry.body&&(!entry.loaded||entry.dirty)&&render(target),scroller.scrollTop=entry.scrollTop||0}let api={configureApp(value){app=value,onClear(content),onClear(navigation),content.replaceChildren(),navigation.replaceChildren(),sections.clear(),sections.set("preferences",{element:preferences,button:generalButton});for(let group of[...picker.querySelectorAll("optgroup")])group.remove();if(!app){select("preferences");return}let name=document.createElement("p");name.className="studio-settings-app-name",name.textContent="This app \xB7 "+app.name,navigation.append(name);let options=document.createElement("optgroup");options.label="This app \xB7 "+app.name,picker.append(options);for(let[id,title]of[["general","General"],["connection","AI Gateway & Sandbox"],["prereqs","Prerequisites & CLI tools"],["ports","Local ports"],["danger","Danger zone"]]){let element=document.createElement("section");element.className="studio-settings-section",element.dataset.settingsSection=id;let heading=document.createElement("h3");heading.id="studio-settings-"+id,heading.textContent=title,element.setAttribute("aria-labelledby",heading.id);let scope=document.createElement("p");scope.className="studio-settings-scope",scope.textContent=id==="prereqs"?"This device \xB7 Requirements for "+app.name:"This app \xB7 "+app.name;let body=document.createElement("div");body.dataset.settingsBody="",element.append(scope,heading,body);let button=window.appPlatformButtons.create({appearance:"subtle",children:title,"data-settings-target":id,onClick:()=>select(id)});window.appPlatformButtons.append(navigation,button);let option=document.createElement("option");option.value=id,option.textContent=title,options.append(option),sections.set(id,{element,body,button}),content.append(element)}select("preferences")},setAppName(name){if(app){app.name=name,navigation.querySelector(".studio-settings-app-name").textContent="This app \xB7 "+name,picker.querySelector("optgroup").label="This app \xB7 "+name;for(let entry of sections.values()){let scope=entry.element.querySelector(".studio-settings-scope");entry.body&&scope&&(scope.textContent=entry.element.dataset.settingsSection==="prereqs"?"This device \xB7 Requirements for "+name:"This app \xB7 "+name)}api.refreshApp()}},open(section="preferences"){dialog.open||(returnFocus=document.activeElement,dialog.showModal(),onOpen?.()),select(section),(!dialog.contains(document.activeElement)||!document.activeElement.checkVisibility())&&(picker.checkVisibility()?picker:sections.get(selected).button).focus({preventScroll:!0})},close(){dialog.close()},isOpen(section){return dialog.open&&(!section||selected===section)},refreshApp(){if(dialog.open){for(let entry of sections.values())entry.body&&(entry.dirty=!0);render(selected)}}};return generalButton.addEventListener("click",()=>select("preferences")),picker.addEventListener("change",()=>select(picker.value)),dialog.querySelector("[data-settings-close]").addEventListener("click",()=>api.close()),dialog.addEventListener("close",()=>{if(dialog.open)return;for(let entry of sections.values())entry.body&&(onClear(entry.body),entry.body.replaceChildren(),entry.loaded=!1,entry.scrollTop=0);let target=returnFocus?.isConnected&&!returnFocus.disabled&&returnFocus.getClientRects().length?returnFocus:document.querySelector("dialog[open] [autofocus]")||trigger,active=document.activeElement;(active===document.body||dialog.contains(active)||!active.checkVisibility())&&target.focus({preventScroll:!0})}),dialog.addEventListener("keydown",event=>{if(event.key==="Escape"&&event.stopPropagation(),event.key!=="Tab")return;let focusable=[...dialog.querySelectorAll("button, input, select, textarea, summary, a[href], [tabindex]")].filter(node=>!node.disabled&&node.tabIndex>=0&&node.checkVisibility());if(!focusable.length||event.altKey||event.ctrlKey||event.metaKey)return;event.preventDefault();let index=focusable.indexOf(document.activeElement),next=index<0?event.shiftKey?focusable.length-1:0:(index+(event.shiftKey?-1:1)+focusable.length)%focusable.length;focusable[next].focus()}),api}var icons_default={agent:{width:16,height:16,path:'<path d="M14.5 8.9v-.052A2.956 2.956 0 0 0 11.542 5.9a.815.815 0 0 1-.751-.501l-.145-.348A3.496 3.496 0 0 0 7.421 2.9h-.206a3.754 3.754 0 0 0-3.736 4.118l.011.121a.822.822 0 0 1-.619.879A1.81 1.81 0 0 0 1.5 9.773v.14c0 1.097.89 1.987 1.987 1.987H4.5a.75.75 0 0 1 0 1.5H3.487A3.487 3.487 0 0 1 0 9.913v-.14C0 8.449.785 7.274 1.963 6.75A5.253 5.253 0 0 1 7.215 1.4h.206a4.992 4.992 0 0 1 4.586 3.024A4.455 4.455 0 0 1 16 8.848V8.9a.75.75 0 0 1-1.5 0Z"></path><path d="m8.38 7.67 2.25 2.25a.749.749 0 0 1 0 1.061L8.38 13.23a.749.749 0 1 1-1.06-1.06l1.719-1.72L7.32 8.731A.75.75 0 0 1 8.38 7.67ZM15 13.45h-3a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 0 1.5Z"></path>'},alert:{width:16,height:16,path:'<path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>'},apps:{width:16,height:16,path:'<path d="M1.5 3.25c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 5.75 7.5h-2.5A1.75 1.75 0 0 1 1.5 5.75Zm7 0c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5A1.75 1.75 0 0 1 8.5 5.75Zm-7 7c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5a1.75 1.75 0 0 1-1.75-1.75Zm7 0c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5a1.75 1.75 0 0 1-1.75-1.75ZM3.25 3a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5A.25.25 0 0 0 6 5.75v-2.5A.25.25 0 0 0 5.75 3Zm7 0a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25Zm-7 7a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25Zm7 0a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25Z"></path>'},"arrow-left":{width:16,height:16,path:'<path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>'},"arrow-right":{width:16,height:16,path:'<path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z"></path>'},browser:{width:16,height:16,path:'<path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25ZM14.5 6h-13v7.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Zm-6-3.5v2h6V2.75a.25.25 0 0 0-.25-.25ZM5 2.5v2h2v-2Zm-3.25 0a.25.25 0 0 0-.25.25V4.5h2v-2Z"></path>'},check:{width:16,height:16,path:'<path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>'},"chevron-down":{width:16,height:16,path:'<path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>'},"chevron-right":{width:16,height:16,path:'<path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"></path>'},cloud:{width:16,height:16,path:'<path d="M2 7.25A5.225 5.225 0 0 1 7.25 2a5.222 5.222 0 0 1 4.767 3.029A4.472 4.472 0 0 1 16 9.5c0 2.505-1.995 4.5-4.5 4.5h-8A3.474 3.474 0 0 1 0 10.5c0-1.41.809-2.614 2.001-3.17Zm1.54.482a.75.75 0 0 1-.556.832c-.86.22-1.484.987-1.484 1.936 0 1.124.876 2 2 2h8c1.676 0 3-1.324 3-3s-1.324-3-3-3a.75.75 0 0 1-.709-.504A3.72 3.72 0 0 0 7.25 3.5C5.16 3.5 3.5 5.16 3.5 7.25c.002.146.014.292.035.436l.004.036.001.008Z"></path>'},code:{width:16,height:16,path:'<path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"></path>'},codespaces:{width:16,height:16,path:'<path d="M0 11.25c0-.966.784-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75v3A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm2-9.5C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 2 6.75Zm1.75-.25a.25.25 0 0 0-.25.25v5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5a.25.25 0 0 0-.25-.25Zm-2 9.5a.25.25 0 0 0-.25.25v3c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-3a.25.25 0 0 0-.25-.25Z"></path><path d="M7 12.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm-4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z"></path>'},"comment-discussion":{width:16,height:16,path:'<path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z"></path>'},database:{width:16,height:16,path:'<path d="M1 3.5c0-.626.292-1.165.7-1.59.406-.422.956-.767 1.579-1.041C4.525.32 6.195 0 8 0c1.805 0 3.475.32 4.722.869.622.274 1.172.62 1.578 1.04.408.426.7.965.7 1.591v9c0 .626-.292 1.165-.7 1.59-.406.422-.956.767-1.579 1.041C11.476 15.68 9.806 16 8 16c-1.805 0-3.475-.32-4.721-.869-.623-.274-1.173-.62-1.579-1.04-.408-.426-.7-.965-.7-1.591Zm1.5 0c0 .133.058.318.282.551.227.237.591.483 1.101.707C4.898 5.205 6.353 5.5 8 5.5c1.646 0 3.101-.295 4.118-.742.508-.224.873-.471 1.1-.708.224-.232.282-.417.282-.55 0-.133-.058-.318-.282-.551-.227-.237-.591-.483-1.101-.707C11.102 1.795 9.647 1.5 8 1.5c-1.646 0-3.101.295-4.118.742-.508.224-.873.471-1.1.708-.224.232-.282.417-.282.55Zm0 4.5c0 .133.058.318.282.551.227.237.591.483 1.101.707C4.898 9.705 6.353 10 8 10c1.646 0 3.101-.295 4.118-.742.508-.224.873-.471 1.1-.708.224-.232.282-.417.282-.55V5.724c-.241.15-.503.286-.778.407C11.475 6.68 9.805 7 8 7c-1.805 0-3.475-.32-4.721-.869a6.15 6.15 0 0 1-.779-.407Zm0 2.225V12.5c0 .133.058.318.282.55.227.237.592.484 1.1.708 1.016.447 2.471.742 4.118.742 1.647 0 3.102-.295 4.117-.742.51-.224.874-.47 1.101-.707.224-.233.282-.418.282-.551v-2.275c-.241.15-.503.285-.778.406-1.247.549-2.917.869-4.722.869-1.805 0-3.475-.32-4.721-.869a6.327 6.327 0 0 1-.779-.406Z"></path>'},"dot-fill":{width:16,height:16,path:'<path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>'},eye:{width:16,height:16,path:'<path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>'},gear:{width:16,height:16,path:'<path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path>'},info:{width:16,height:16,path:'<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>'},"kebab-horizontal":{width:16,height:16,path:'<path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>'},link:{width:16,height:16,path:'<path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>'},"link-external":{width:16,height:16,path:'<path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path>'},"list-unordered":{width:16,height:16,path:'<path d="M5.75 2.5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM2 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM2 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>'},meter:{width:16,height:16,path:'<path d="M8 1.5a6.5 6.5 0 1 0 6.016 4.035.75.75 0 0 1 1.388-.57 8 8 0 1 1-4.37-4.37.75.75 0 1 1-.569 1.389A6.473 6.473 0 0 0 8 1.5Zm6.28.22a.75.75 0 0 1 0 1.06l-4.063 4.064a2.5 2.5 0 1 1-1.06-1.06L13.22 1.72a.75.75 0 0 1 1.06 0ZM7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"></path>'},play:{width:16,height:16,path:'<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"></path>'},plus:{width:16,height:16,path:'<path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>'},project:{width:16,height:16,path:'<path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM11.75 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm-8.25.75a.75.75 0 0 1 1.5 0v5.5a.75.75 0 0 1-1.5 0ZM8 3a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 3Z"></path>'},question:{width:16,height:16,path:'<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.92 6.085h.001a.749.749 0 1 1-1.342-.67c.169-.339.436-.701.849-.977C6.845 4.16 7.369 4 8 4a2.756 2.756 0 0 1 1.637.525c.503.377.863.965.863 1.725 0 .448-.115.83-.329 1.15-.205.307-.47.513-.692.662-.109.072-.22.138-.313.195l-.006.004a6.24 6.24 0 0 0-.26.16.952.952 0 0 0-.276.245.75.75 0 0 1-1.248-.832c.184-.264.42-.489.692-.661.103-.067.207-.132.313-.195l.007-.004c.1-.061.182-.11.258-.161a.969.969 0 0 0 .277-.245C8.96 6.514 9 6.427 9 6.25a.612.612 0 0 0-.262-.525A1.27 1.27 0 0 0 8 5.5c-.369 0-.595.09-.74.187a1.01 1.01 0 0 0-.34.398ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>'},"screen-full":{width:16,height:16,path:'<path d="M1.75 10a.75.75 0 0 1 .75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 1 13.25v-2.5a.75.75 0 0 1 .75-.75Zm12.5 0a.75.75 0 0 1 .75.75v2.5A1.75 1.75 0 0 1 13.25 15h-2.5a.75.75 0 0 1 0-1.5h2.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 .75-.75ZM2.75 2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C1 1.784 1.784 1 2.75 1h2.5a.75.75 0 0 1 0 1.5ZM10 1.75a.75.75 0 0 1 .75-.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.25.25 0 0 0-.25-.25h-2.5a.75.75 0 0 1-.75-.75Z"></path>'},search:{width:16,height:16,path:'<path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path>'},"shield-check":{width:16,height:16,path:'<path d="m8.533.133 5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667l5.25-1.68a1.748 1.748 0 0 1 1.066 0Zm-.61 1.429.001.001-5.25 1.68a.251.251 0 0 0-.174.237V7c0 1.36.275 2.666 1.057 3.859.784 1.194 2.121 2.342 4.366 3.298a.196.196 0 0 0 .154 0c2.245-.957 3.582-2.103 4.366-3.297C13.225 9.666 13.5 8.358 13.5 7V3.48a.25.25 0 0 0-.174-.238l-5.25-1.68a.25.25 0 0 0-.153 0ZM11.28 6.28l-3.5 3.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l.97.97 2.97-2.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>'},"shield-lock":{width:16,height:16,path:'<path d="m8.533.133 5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667l5.25-1.68a1.748 1.748 0 0 1 1.066 0Zm-.61 1.429.001.001-5.25 1.68a.251.251 0 0 0-.174.237V7c0 1.36.275 2.666 1.057 3.859.784 1.194 2.121 2.342 4.366 3.298a.196.196 0 0 0 .154 0c2.245-.957 3.582-2.103 4.366-3.297C13.225 9.666 13.5 8.358 13.5 7V3.48a.25.25 0 0 0-.174-.238l-5.25-1.68a.25.25 0 0 0-.153 0ZM9.5 6.5c0 .536-.286 1.032-.75 1.3v2.45a.75.75 0 0 1-1.5 0V7.8A1.5 1.5 0 1 1 9.5 6.5Z"></path>'},"sidebar-collapse":{width:16,height:16,path:'<path d="M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z"></path><path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z"></path>'},"sidebar-expand":{width:16,height:16,path:'<path d="m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z"></path><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z"></path>'},skip:{width:16,height:16,path:'<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l5.5-5.5a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>'},square:{width:16,height:16,path:'<path d="M4 5.75C4 4.784 4.784 4 5.75 4h4.5c.966 0 1.75.784 1.75 1.75v4.5A1.75 1.75 0 0 1 10.25 12h-4.5A1.75 1.75 0 0 1 4 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v4.5c0 .138.112.25.25.25h4.5a.25.25 0 0 0 .25-.25v-4.5a.25.25 0 0 0-.25-.25Z"></path>'},stopwatch:{width:16,height:16,path:'<path d="M5.75.75A.75.75 0 0 1 6.5 0h3a.75.75 0 0 1 0 1.5h-.75v1l-.001.041a6.724 6.724 0 0 1 3.464 1.435l.007-.006.75-.75a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734l-.75.75-.006.007a6.75 6.75 0 1 1-10.548 0L2.72 5.03l-.75-.75a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l.75.75.007.006A6.72 6.72 0 0 1 7.25 2.541V1.5H6.5a.75.75 0 0 1-.75-.75ZM8 14.5a5.25 5.25 0 1 0-.001-10.501A5.25 5.25 0 0 0 8 14.5Zm.389-6.7 1.33-1.33a.75.75 0 1 1 1.061 1.06L9.45 8.861A1.503 1.503 0 0 1 8 10.75a1.499 1.499 0 1 1 .389-2.95Z"></path>'},sync:{width:16,height:16,path:'<path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"></path>'},terminal:{width:16,height:16,path:'<path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM7.25 8a.749.749 0 0 1-.22.53l-2.25 2.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L5.44 8 3.72 6.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.25 2.25c.141.14.22.331.22.53Zm1.5 1.5h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Z"></path>'},tools:{width:16,height:16,path:'<path d="M5.433 2.304A4.492 4.492 0 0 0 3.5 6c0 1.598.832 3.002 2.09 3.802.518.328.929.923.902 1.64v.008l-.164 3.337a.75.75 0 1 1-1.498-.073l.163-3.33c.002-.085-.05-.216-.207-.316A5.996 5.996 0 0 1 2 6a5.993 5.993 0 0 1 2.567-4.92 1.482 1.482 0 0 1 1.673-.04c.462.296.76.827.76 1.423v2.82c0 .082.041.16.11.206l.75.51a.25.25 0 0 0 .28 0l.75-.51A.249.249 0 0 0 9 5.282V2.463c0-.596.298-1.127.76-1.423a1.482 1.482 0 0 1 1.673.04A5.993 5.993 0 0 1 14 6a5.996 5.996 0 0 1-2.786 5.068c-.157.1-.209.23-.207.315l.163 3.33a.752.752 0 0 1-1.094.714.75.75 0 0 1-.404-.64l-.164-3.345c-.027-.717.384-1.312.902-1.64A4.495 4.495 0 0 0 12.5 6a4.492 4.492 0 0 0-1.933-3.696c-.024.017-.067.067-.067.16v2.818a1.75 1.75 0 0 1-.767 1.448l-.75.51a1.75 1.75 0 0 1-1.966 0l-.75-.51A1.75 1.75 0 0 1 5.5 5.282V2.463c0-.092-.043-.142-.067-.159Z"></path>'},trash:{width:16,height:16,path:'<path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"></path>'},workflow:{width:16,height:16,path:'<path d="M0 1.75C0 .784.784 0 1.75 0h3.5C6.216 0 7 .784 7 1.75v3.5A1.75 1.75 0 0 1 5.25 7H4v4a1 1 0 0 0 1 1h4v-1.25C9 9.784 9.784 9 10.75 9h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 14.25 16h-3.5A1.75 1.75 0 0 1 9 14.25v-.75H5A2.5 2.5 0 0 1 2.5 11V7h-.75A1.75 1.75 0 0 1 0 5.25Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25Zm9 9a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25Z"></path>'},x:{width:16,height:16,path:'<path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>'},"zoom-in":{width:16,height:16,path:'<path d="M3.75 7.5a.75.75 0 0 1 .75-.75h2.25V4.5a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5H8.25v2.25a.75.75 0 0 1-1.5 0V8.25H4.5a.75.75 0 0 1-.75-.75Z"></path><path d="M7.5 0a7.5 7.5 0 0 1 5.807 12.247l2.473 2.473a.749.749 0 1 1-1.06 1.06l-2.473-2.473A7.5 7.5 0 1 1 7.5 0Zm-6 7.5a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z"></path>'},"zoom-out":{width:16,height:16,path:'<path d="M4.5 6.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5Z"></path><path d="M0 7.5a7.5 7.5 0 1 1 13.307 4.747l2.473 2.473a.749.749 0 1 1-1.06 1.06l-2.473-2.473A7.5 7.5 0 0 1 0 7.5Zm7.5-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"></path>'}};function renderOcticon(name,{size=16,className=""}={}){let icon=icons_default[name];if(!icon)throw new Error(`Unknown shipped Octicon: ${name}`);if(!Number.isFinite(size)||size<=0||!/^[a-zA-Z0-9 _-]*$/.test(className))throw new Error("Invalid Octicon presentation.");return`<svg xmlns="http://www.w3.org/2000/svg" class="octicon${className?` ${className}`:""}" data-octicon="${name}" viewBox="0 0 ${icon.width} ${icon.height}" width="${size*icon.width/icon.height}" height="${size}" fill="currentColor" aria-hidden="true" focusable="false">${icon.path}</svg>`}function octiconMask(name){return`url("data:image/svg+xml,${encodeURIComponent(renderOcticon(name)).replaceAll("'","%27")}")`}var OCTICON_MARKUP=Object.fromEntries(Object.keys(icons_default).map(name=>[name,renderOcticon(name)])),OCTICON_CSS=`
  .octicon { display:inline-block; flex:none; fill:currentColor; stroke:none; vertical-align:text-bottom; }
`;var COREAI_AZURE_VISUAL_PROFILE=Object.freeze({id:"coreai-azure",className:"canvas-profile-coreai-azure",stylesheet:"canvas-ui/profiles/coreai-azure.css"}),GITHUB_APP_VISUAL_PROFILE=Object.freeze({id:"github-app",className:"canvas-profile-github-app",stylesheet:"canvas-ui/profiles/github-app.css",designGuide:"canvas-ui/hosts/github-app/design.md",themingGuide:"canvas-ui/hosts/github-app/theming.md"}),canvasVisualProfiles=Object.freeze({[COREAI_AZURE_VISUAL_PROFILE.id]:COREAI_AZURE_VISUAL_PROFILE,[GITHUB_APP_VISUAL_PROFILE.id]:GITHUB_APP_VISUAL_PROFILE});function getCanvasVisualProfile(id){if(typeof id!="string"||!Object.hasOwn(canvasVisualProfiles,id))throw new RangeError(`Unknown canvas visual profile: ${id}.`);return canvasVisualProfiles[id]}var copilotProfile=getCanvasVisualProfile("github-app"),sharedPresentationStyles=`
  :root.studio-shared-presentation {
    --studio-bg: var(--canvas-bg);
    --studio-panel: var(--canvas-tint);
    --studio-raised: var(--canvas-bg);
    --studio-line: var(--canvas-border);
    --studio-ink: var(--canvas-fg);
    --studio-muted: var(--canvas-muted);
    --studio-accent: var(--canvas-accent);
    --studio-accent-2: var(--canvas-accent);
    --studio-accent-soft: var(--canvas-selected);
    --studio-ok: var(--canvas-success);
    --studio-warn: var(--canvas-attention);
    --studio-danger: var(--canvas-danger);
    --studio-focus: var(--canvas-focus);
    --studio-edge-medium: var(--canvas-accent);
    --studio-edge-low: var(--canvas-muted);
    --studio-blue-soft: var(--canvas-selected);
    --studio-on-accent: var(--text-color-button-primary-rest, var(--canvas-button-primary-fg));
    --studio-control-radius: var(--canvas-radius-control);
    --studio-surface-radius: var(--canvas-radius-surface);
    --studio-dialog-radius: var(--canvas-radius-dialog);
    --studio-space-condensed: var(--canvas-spacing-condensed);
    --studio-space-normal: var(--canvas-spacing-normal);
    --studio-space-spacious: var(--canvas-spacing-spacious);
    --studio-control-height: var(--canvas-control-height);
    --studio-control-padding: var(--canvas-control-padding-block) var(--canvas-control-padding-inline);
    --studio-border-width: var(--canvas-border-width);
  }
  :root.studio-shared-presentation[data-theme-tone="light"],
  :root.studio-shared-presentation:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="light"] { color-scheme: light; }
  :root.studio-shared-presentation[data-theme-tone="dark"],
  :root.studio-shared-presentation:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="dark"] { color-scheme: dark; }
  :root.studio-shared-presentation :is(dialog, [role="dialog"]) {
    --studio-raised: var(--canvas-overlay);
  }
  :root.studio-shared-presentation :is(button.primary, button.run-button-primary) {
    color: var(--text-color-button-primary-rest, var(--canvas-button-primary-fg));
    background: var(--background-color-button-primary-rest, var(--canvas-button-primary-bg));
    border-color: var(--border-color-button-primary-rest, var(--canvas-border));
  }
  :root.studio-shared-presentation :is(button.primary, button.run-button-primary):hover:not(:disabled) {
    background: var(--background-color-button-primary-hover, var(--background-color-button-primary-rest, var(--canvas-button-primary-bg)));
    border-color: var(--border-color-button-primary-hover, var(--border-color-button-primary-rest, var(--canvas-border)));
  }
  :root.studio-shared-presentation :is(button.primary, button.run-button-primary):active:not(:disabled) {
    background: var(--background-color-button-primary-active, var(--background-color-button-primary-rest, var(--canvas-button-primary-bg)));
  }
`,standaloneAliases=`
  :root[data-studio-theme="light"] {
    color-scheme: light;
    --studio-bg: #f6f8fa; --studio-panel: #f0f3f8; --studio-raised: #ffffff;
    --studio-line: #d1d9e0; --studio-ink: #1f2328; --studio-muted: #59636e;
    --studio-accent: #6b3fd6; --studio-accent-2: #5c2eb8; --studio-accent-soft: #f1eaff;
    --studio-ok: #137333; --studio-warn: #9a5100; --studio-danger: #b42318;
    --studio-focus: #0969da; --studio-edge-medium: #0969da; --studio-edge-low: #68717a;
    --studio-blue-soft: #e7f1ff; --studio-on-accent: #ffffff;
  }
  :root[data-studio-theme="dark"] {
    color-scheme: dark;
    --studio-bg: #15171c; --studio-panel: #20232b; --studio-raised: #1b1e25;
    --studio-line: #454b57; --studio-ink: #edf0f5; --studio-muted: #b6becb;
    --studio-accent: #c5a6ff; --studio-accent-2: #d6c0ff; --studio-accent-soft: #36264e;
    --studio-ok: #7bdba0; --studio-warn: #f0b563; --studio-danger: #ff9b91;
    --studio-focus: #81baff; --studio-edge-medium: #81baff; --studio-edge-low: #a6afbb;
    --studio-blue-soft: #182d46; --studio-on-accent: #20132f;
  }
  :root[data-studio-theme] body {
    --background-color-default: var(--studio-raised); --border-color-default: var(--studio-line);
    --text-color-default: var(--studio-ink); --text-color-muted: var(--studio-muted);
    --color-focus-outline: var(--studio-focus); --true-color-purple: var(--studio-accent);
    --true-color-blue: var(--studio-edge-medium); --true-color-green: var(--studio-ok);
    --true-color-blue-muted: var(--studio-blue-soft);
    --true-color-red: var(--studio-danger); --true-color-orange: var(--studio-warn);
  }
`,sharedPresentationLayout=`
  :root.studio-shared-presentation { font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif); }
  :root.studio-shared-presentation body { background: var(--studio-bg); }
  :root.studio-shared-presentation :is(#details, #customize-content) code {
    font-family: var(--font-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
  }
  :root.studio-shared-presentation body,
  :root.studio-shared-presentation .studio-workspace-content,
  :root.studio-shared-presentation .run-execution-view,
  :root.studio-shared-presentation :is(#details, #customize-content)[data-mode="build"],
  :root.studio-shared-presentation #details[data-mode="manage"],
  :root.studio-shared-presentation .studio-settings {
    font: var(--text-body-medium, 14px)/var(--leading-body-medium, 1.25rem) var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  }
  :root.studio-shared-presentation :is(input, textarea, select):not(:where(#studio-home *)),
  :root.studio-shared-presentation #details :is(input, textarea, select),
  :root.studio-shared-presentation .studio-settings :is(input, textarea, select) {
    border-width: var(--studio-border-width);
    border-radius: var(--studio-control-radius);
    font-family: inherit;
    font-size: var(--text-body-ui, var(--text-body-medium, 14px));
    line-height: var(--leading-body-ui, var(--leading-body-medium, 1.25rem));
  }
  :root.studio-shared-presentation :is(input[type="text"], input[type="search"], select):not(:where(#studio-home *)),
  :root.studio-shared-presentation #details :is(input[type="text"], input[type="search"], select),
  :root.studio-shared-presentation .studio-settings select {
    min-height: var(--studio-control-height); padding: var(--studio-control-padding);
  }
  :root.studio-shared-presentation :is(.journey, .choice, .capability, .mapping, .review-row, .surface, .subsurface, .tier-card, .map-node, .map-empty, .map-loading, .header-actions, .endpoint-row, .action-card, .management-section),
  :root.studio-shared-presentation :is(#details, #run-execution-workspace) :is(.run-card, .agent-response, .document-assessment, .command-output, .action-card, .management-section) {
    border-radius: var(--studio-surface-radius);
  }
  :root.studio-shared-presentation :is(.journey, .choice, .capability, .mapping, .review-row, .subsurface, .tier-card),
  :root.studio-shared-presentation :is(#details, #run-execution-workspace) :is(.run-card, .agent-response, .document-assessment) {
    padding: var(--studio-space-normal);
  }
  :root.studio-shared-presentation :is(.studio-settings, .confirm-dialog) { border-radius: var(--studio-dialog-radius); }
  :root.studio-shared-presentation :is(.studio-settings-heading, .studio-settings-content, .confirm-dialog) { padding: var(--studio-space-normal); }
  :root.studio-shared-presentation :is(.journeys, .actions, .actions-right) { gap: var(--studio-space-condensed); }
  :root.studio-shared-presentation #details[data-mode="manage"] { padding: var(--studio-space-spacious); }
  @media (max-width: 620px) {
    :root.studio-shared-presentation #details[data-mode="manage"] { padding: var(--studio-space-normal); }
  }
`,profiles=Object.freeze({standalone:Object.freeze({id:"standalone",className:"",stylesheet:null,styles:"",legacyStyles:standaloneAliases,appearanceDescription:"Applies to Azure App Platform across your apps."}),"github-app":Object.freeze({id:copilotProfile.id,className:`studio-shared-presentation ${copilotProfile.className}`,stylesheet:`/${copilotProfile.stylesheet}`,styles:sharedPresentationStyles+sharedPresentationLayout,legacyStyles:"",appearanceDescription:"Fallback appearance when the host has not supplied a theme. Copilot controls the embedded appearance."})}),STUDIO_PRESENTATION_IDS=Object.freeze(Object.keys(profiles));function getStudioPresentation(id="standalone"){if(!Object.hasOwn(profiles,id))throw new RangeError(`Unsupported Canvas presentation profile: ${String(id)}`);return profiles[id]}function renderPresentationStyles(id="standalone"){return getStudioPresentation(id).styles}function validateTheme(theme){if(theme!=="light"&&theme!=="dark"){let error=new Error("Choose light or dark for the Canvas theme.");throw error.statusCode=400,error}return theme}function renderThemeStyles(presentationProfile="standalone"){let presentation=getStudioPresentation(presentationProfile);return`
    ${OCTICON_CSS}
    :root[data-studio-theme] {
      --bg: var(--studio-bg); --surface: var(--studio-raised); --surface-muted: var(--studio-panel);
      --border: var(--studio-line); --text: var(--studio-ink); --muted: var(--studio-muted);
      --accent: var(--studio-accent); --accent-soft: var(--studio-accent-soft); --focus: var(--studio-focus);
      --edge-high: var(--studio-accent); --edge-medium: var(--studio-edge-medium);
      --edge-low: var(--studio-edge-low); --danger: var(--studio-danger);
    }
    ${presentation.legacyStyles}
    :is(.simple-home-art, .open-app-empty-art, .agent-result-illustration) [data-spot-role="outline"] { stroke: var(--studio-ink); }
    :is(.simple-home-art, .open-app-empty-art, .agent-result-illustration) [data-spot-role="supporting-detail"] { stroke: var(--studio-muted); }
    :is(.simple-home-art, .open-app-empty-art, .agent-result-illustration) [data-spot-role="accent"] { stroke: var(--studio-accent); }
    :is(.simple-home-art, .open-app-empty-art, .agent-result-illustration) [data-spot-role="supporting-detail"] circle[fill] { fill: var(--studio-muted); }
    :is(.simple-home-art, .open-app-empty-art, .agent-result-illustration) [data-spot-role="accent"] circle[fill] { fill: var(--studio-accent); }
    :is(.simple-home-art, .open-app-empty-art, .agent-result-illustration) [data-spot-role="surface"] { fill: var(--studio-raised); }
    .studio-site-nav { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 0; }
    .studio-brand { display: inline-flex; align-items: center; gap: 8px; color: var(--studio-ink); font-size: 13px; font-weight: 600; text-decoration: none; white-space: nowrap; }
    .studio-logo { flex: 0 0 auto; width: 32px; height: 28px; object-fit: contain; }
    .studio-brand:focus-visible { outline: 2px solid var(--studio-focus); outline-offset: 3px; border-radius: 4px; }
    .studio-theme-control { display: flex; align-items: center; gap: 10px; position: relative; }
    .studio-theme-error { position: absolute; z-index: 10; top: 100%; right: 0; width: min(260px, calc(100vw - 32px)); padding: 8px; border: 1px solid var(--studio-line); border-radius: 4px; background: var(--studio-raised); color: var(--studio-danger); font-size: 12px; }
    .studio-theme-error:empty { display: none; }
    button.primary, button.run-button-primary { color: var(--studio-on-accent); background: var(--studio-accent); border-color: var(--studio-accent); }
    .actions button.primary, .header-actions > button.primary { color: var(--studio-on-accent); background: var(--studio-accent); border-color: var(--studio-accent); }
    #details[data-mode="manage"] button.primary, #details[data-mode="manage"] button.primary:hover:not(:disabled) { color: var(--studio-on-accent); }
    button.primary:hover, button.run-button-primary:hover { background: var(--studio-accent-2); border-color: var(--studio-accent-2); }
    button.run-button-danger { color: var(--studio-danger); border-color: var(--studio-danger); }
    button:not(.ct-button):disabled { cursor: not-allowed; opacity: .65; }
    button:not(.ct-button):focus-visible { outline: 2px solid var(--studio-focus); outline-offset: 3px; }
    .runtime-badge[data-tone="success"], .tool-status.ready { color: var(--studio-ok); border-color: var(--studio-ok); }
    .runtime-badge[data-tone="warning"] { color: var(--studio-warn); border-color: var(--studio-warn); }
    .node-visual { color: var(--studio-accent); }
    .node-visual[data-tier-id="web"], .node-visual[data-tier-id="workflows"], .node-visual[data-tier-id="gateway"], .node-visual[data-tier-id="connectors"] { color: var(--studio-edge-medium); }
    .node-visual[data-tier-id="agent"], .node-visual[data-tier-id="sre"] { color: var(--studio-accent); }
    .node-visual[data-tier-id="skills"], .node-visual[data-tier-id="data"] { color: var(--studio-ok); }
    .node-visual[data-tier-id="sandbox"] { color: var(--studio-muted); }
    a { color: var(--studio-accent); }
    ${SETTINGS_CSS}
  `}function renderThemeToggle(theme="light",presentationProfile="standalone"){validateTheme(theme);let presentation=getStudioPresentation(presentationProfile);return`<div class="studio-theme-control" role="group" aria-label="App utilities">
    <span data-studio-utilities-menu></span>
    <span class="studio-theme-error" role="status"></span>
    <span class="studio-theme-error" data-studio-editor-status role="status"></span>
    <dialog class="studio-settings" aria-labelledby="studio-settings-title">
      <div class="studio-settings-heading"><h2 id="studio-settings-title">Settings</h2><button data-studio-button="subtle" type="button" class="studio-settings-close" data-settings-close aria-label="Close settings" autofocus>${renderOcticon("x")}</button></div>
      <div class="studio-settings-layout">
        <nav class="studio-settings-navigation" aria-label="Settings sections">
          <p class="studio-settings-scope">Across all apps</p>
          <button data-studio-button="subtle" type="button" data-settings-target="preferences" aria-current="page">General</button>
          <div data-settings-app-navigation></div>
        </nav>
        <label class="studio-settings-compact-navigation">Settings section
          <select aria-label="Settings section" data-settings-navigation><option value="preferences">General \xB7 Across all apps</option></select>
        </label>
        <div class="studio-settings-content" tabindex="0" aria-label="Selected settings">
        <section class="studio-settings-section" data-settings-section="preferences" aria-labelledby="studio-settings-general">
        <p class="studio-settings-scope">Across all apps</p>
        <h3 id="studio-settings-general">General</h3>
        <label>Appearance<select aria-label="Appearance" data-studio-theme-select><option value="light"${theme==="light"?" selected":""}>Light</option><option value="dark"${theme==="dark"?" selected":""}>Dark</option></select></label>
        <p>${presentation.appearanceDescription}</p>
        <p class="error studio-settings-error" role="alert"></p>
        <label class="studio-editor-preference">Preferred external editor<select aria-label="Preferred external editor" data-studio-editor-select><option value="vscode">VS Code</option></select></label>
        <p>Used for external-editor actions across your apps. VS Code is the default.</p>
        <p class="error studio-settings-error" data-studio-editor-error role="alert"></p>
        </section>
        <div data-settings-app></div>
        </div>
      </div>
    </dialog>
  </div>`}function renderThemeClientScript(apiToken,editorSettings={editorId:"vscode",editors:[{id:"vscode",label:"VS Code"}]}){let token=JSON.stringify(apiToken).replaceAll("<","\\u003c");return`
    (() => {
      const controls = [...document.querySelectorAll("[data-studio-theme-select]")];
      const errorDisplay = document.querySelector(".studio-theme-error");
      const settingsError = document.querySelector(".studio-settings-error");
      const dialog = document.querySelector(".studio-settings");
      const editorPreference = (${createEditorPreference.toString()})({
        select: dialog.querySelector("[data-studio-editor-select]"),
        errorDisplay: dialog.querySelector("[data-studio-editor-error]"),
        globalError: document.querySelector("[data-studio-editor-status]"),
        dialog,
        initialSettings: ${JSON.stringify(editorSettings).replaceAll("<","\\u003c")},
        request: async (path, options = {}) => {
          const response = await fetch(path, {
            ...options, headers: { "Content-Type": "application/json", "X-App-Platform-Token": ${token} },
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Editor preference request failed.");
          return result;
        },
        onChange: (state) => window.dispatchEvent(new CustomEvent("app-platform-editor-settings-change", { detail: state })),
      });
      window.appPlatformEditorPreference = editorPreference;
      const buttons = window.appPlatformButtons;
      const utilitiesTrigger = buttons.menu({
        label: null, positioning: "below-end",
        button: {
          appearance: "subtle", size: "small", className: "studio-utilities-toggle", tabIndex: 0,
          icon: buttons.icon(${JSON.stringify(renderOcticon("kebab-horizontal"))}),
          "aria-label": "More options", title: "More options", "data-studio-utilities-toggle": "",
        },
        items: [
          {
            id: "docs", label: "Docs",
            icon: buttons.icon(${JSON.stringify(renderOcticon("link-external"))}),
            onClick: () => window.open(
              "https://github.com/microsoft/azure-dev-tools/tree/azure-app-platform-latest/canvases/azure-app-platform#readme",
              "_blank", "noopener,noreferrer"),
          },
          {
            id: "settings", label: "Settings", "aria-haspopup": "dialog",
            icon: buttons.icon(${JSON.stringify(renderOcticon("gear"))}),
            onClick: () => {
              utilitiesTrigger.focus({ preventScroll: true });
              window.appPlatformSettings.open();
            },
          },
        ],
      });
      buttons.append(document.querySelector("[data-studio-utilities-menu]"), utilitiesTrigger);
      window.appPlatformSettings = (${createStudioSettings.toString()})({
        dialog, trigger: utilitiesTrigger,
        onOpen: () => { void editorPreference.refresh(); },
        onClear: element => {
          window.appPlatformToolkitComponents?.clear(element);
          window.appPlatformButtons?.clear(element);
        },
      });
      window.dispatchEvent(new Event("app-platform-settings-ready"));
      let saving = false;
      let epoch = 0;
      let confirmedTheme = document.documentElement.dataset.studioTheme;
      const reportError = (message) => {
        errorDisplay.textContent = dialog.open ? "" : message;
        settingsError.textContent = message;
      };
      const applyTheme = (theme) => {
        if (!["light", "dark"].includes(theme)) throw new Error("Canvas returned an invalid appearance preference.");
        confirmedTheme = theme;
        document.documentElement.dataset.studioTheme = theme;
        for (const control of controls) control.value = theme;
      };
      for (const control of controls) control.addEventListener("change", async () => {
        if (saving) return;
        saving = true;
        epoch += 1;
        controls.forEach((button) => { button.disabled = true; });
        reportError("");
        try {
          const response = await fetch("/api/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-App-Platform-Token": ${token} },
            body: JSON.stringify({ theme: control.value }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Appearance preference could not be saved.");
          applyTheme(result.theme);
        } catch (error) {
          applyTheme(confirmedTheme);
          reportError(error.message);
        } finally {
          saving = false;
          controls.forEach((button) => { button.disabled = false; });
        }
      });
      const isExpectedAbort = (error) =>
        error?.name === "AbortError" || /Load failed|Failed to fetch|NetworkError/i.test(String(error?.message || ""));
      let navigatingAway = false;
      window.addEventListener("beforeunload", () => { navigatingAway = true; });
      window.addEventListener("pagehide", () => { navigatingAway = true; });
      window.addEventListener("focus", async () => {
        if (navigatingAway || window.__appPlatformSubmitting) return;
        void editorPreference.refresh({ silentNetworkError: true });
        if (saving) return;
        const readEpoch = ++epoch;
        try {
          const response = await fetch("/api/preferences", { headers: { "X-App-Platform-Token": ${token} } });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Appearance preference could not be read.");
          if (!saving && !navigatingAway && !window.__appPlatformSubmitting && readEpoch === epoch) applyTheme(result.theme);
        } catch (error) {
          if (!navigatingAway && !window.__appPlatformSubmitting && !isExpectedAbort(error) && readEpoch === epoch) {
            reportError(error.message);
          }
        }
      });
    })();
  `}import{randomUUID as randomUUID2}from"node:crypto";import{mkdir as mkdir2,readFile as readFile2,rename as rename2,rm,writeFile as writeFile2}from"node:fs/promises";import{join as join2}from"node:path";var EDITOR_CHOICES=Object.freeze([{id:"vscode",label:"VS Code"},{id:"vscode-insiders",label:"VS Code Insiders"},{id:"cursor",label:"Cursor"},{id:"windsurf",label:"Windsurf"},{id:"zed",label:"Zed"},{id:"sublime",label:"Sublime Text"}].map(Object.freeze)),DEFAULT_EDITOR_SETTINGS=Object.freeze({editorId:"vscode",editors:EDITOR_CHOICES});function createStudioNotices({loadToolkit,onError}){let views=new Map;function clearNotice(element){let previous=views.get(element);views.delete(element),previous?.handle?.dispose()}function renderComponent(element,component,props,label="shared component"){if(!element||element.nodeType!==1)throw new TypeError("A component mount element is required.");let view=views.get(element);view&&view.component!==component&&(clearNotice(element),view=null);let existing=!!view;view||(view={component,props:{},callbacks:new Map,handle:null},views.set(element,view));let changed={};for(let[key,value]of Object.entries(props)){typeof value=="function"&&!view.callbacks.has(key)&&view.callbacks.set(key,(...args)=>view.props[key]?.(...args));let previous=typeof view.props[key]=="function"?view.callbacks.get(key):view.props[key],next=typeof value=="function"?view.callbacks.get(key):value;Object.is(previous,next)||(changed[key]=next)}view.props={...view.props,...props};let fail=cause=>{views.get(element)===view&&(clearNotice(element),onError(`Could not load the ${label}: ${cause.message}`))};if(existing){try{Object.keys(changed).length&&view.handle?.update(changed)}catch(cause){fail(cause)}return}let state=view;Promise.resolve().then(loadToolkit).then(toolkit=>{if(views.get(element)!==state)return;if(element.isConnected===!1){clearNotice(element);return}let latest=Object.fromEntries(Object.entries(state.props).map(([key,value])=>[key,typeof value=="function"?state.callbacks.get(key):value]));state.handle=toolkit.mountCanvasComponent(element,toolkit[component],latest)}).catch(fail)}function renderNotice(element,props){if(!element||element.nodeType!==1)throw new TypeError("A notice mount element is required.");if(!props?.children){clearNotice(element);return}renderComponent(element,"MessageBar",props,"review notice")}function dispose(){for(let element of views.keys())clearNotice(element)}return{renderComponent,clearComponent:clearNotice,renderNotice,clearNotice,dispose}}function createStudioButtons(toolkit){let{Button,createElement,mountCanvasComponent}=toolkit,views=new Map,controls=new WeakMap;function Field({kind,label,hint,fieldError,options,...props}){return createElement(toolkit.FormField,{label,hint,error:fieldError,required:props.required},createElement(toolkit[kind],props,options?.map(option=>createElement("option",{key:option.value,value:option.value},option.label))))}function Menu({items,...props}){return createElement(toolkit.MenuButton,props,items.map(({id,label,...item})=>createElement(toolkit.MenuItem,{key:id,...item},label)))}function Split({heading,items,...props}){return createElement(toolkit.SplitButton,props,createElement(toolkit.MenuGroup,null,createElement(toolkit.MenuGroupHeader,null,heading),items.map(({id,label,...item})=>createElement(toolkit.MenuItem,{key:id,...item},label))))}function Segmented({items,value,onValueChange,onReselect,iconOnly=!1,...props}){return createElement(toolkit.ActionToolbar,props,items.map(item=>createElement(toolkit.ToolbarToggleButton,{key:item.value,name:"selection",value:item.value,icon:item.icon,checked:item.value===value,onChange:(event,data)=>{data.checked?onValueChange(item.value):item.value===value&&onReselect?.(item.value)},appearance:"subtle",size:"small","aria-label":item.label,title:item.title??item.label,"aria-controls":item.controls,"data-focus-key":item.focusKey},iconOnly?void 0:item.label)))}function render(element,props,component=Button,selector="button"){let view=views.get(element);view||(view={props:{},callbacks:new Map,handle:null,component,selector},views.set(element,view));let changed={};for(let[key,value]of Object.entries(props)){typeof value=="function"&&!view.callbacks.has(key)&&view.callbacks.set(key,(...args)=>view.props[key]?.(...args));let previous=typeof view.props[key]=="function"?view.callbacks.get(key):view.props[key],next=typeof value=="function"?view.callbacks.get(key):value;Object.is(previous,next)||(changed[key]=next)}if(view.props={...view.props,...props},view.handle)Object.keys(changed).length&&view.handle.update(changed);else{try{view.handle=mountCanvasComponent(element,component,Object.fromEntries(Object.entries(view.props).map(([key,value])=>[key,typeof value=="function"?view.callbacks.get(key):value])))}catch(cause){throw views.delete(element),cause}view.control=selector?element.querySelector(selector):null,view.control&&controls.set(view.control,element)}return view.control}function create(props){let element=document.createElement("span");return element.className="studio-button-mount",render(element,{type:"button",...props})}function field(props){if(!["TextInput","Textarea","Select"].includes(props.kind))throw new Error("Choose a supported toolkit form control.");let element=document.createElement("div");return element.className="studio-field-mount",render(element,props,Field,"input,textarea,select")}function menu(props){let element=document.createElement("span");return element.className="studio-button-mount",render(element,props,Menu)}function split(props){let element=document.createElement("span");return element.className="studio-button-mount",render(element,props,Split,'[role="group"]')}function segmented(props){let element=document.createElement("div");return element.className="studio-segmented-mount",render(element,props,Segmented,'[role="toolbar"]')}function renderComponent(element,name,props){let view=views.get(element);if(view&&view.component!==toolkit[name])throw new Error("Cannot replace an owned toolkit component without clearing it.");render(element,props,toolkit[name],null)}function actionGroup(parent,props={}){let element=document.createElement("div");return element.className="studio-action-mount",parent.append(element),renderComponent(element,"ActionGroup",props),views.get(element).actionChildren=[],element}function host(control){return controls.get(control)??control}function append(parent,...children){let group=views.get(parent);group?.actionChildren?(group.actionChildren.push(...children.map(host)),renderComponent(parent,"ActionGroup",{children:group.actionChildren.map((element,index)=>createElement(toolkit.DomContent,{key:index,element}))})):parent.append(...children.map(host))}function update(control,props){let element=controls.get(control);if(!element||!views.has(element))throw new Error("Cannot update an unowned Studio button.");let view=views.get(element);return render(element,props,view.component,view.selector)}function setDisabled(control,disabled){controls.has(control)?update(control,{disabled}):control.disabled=disabled}function setText(control,children){controls.has(control)?update(control,{children}):control.textContent=children}function clear(root){let owned=[...views].filter(([element])=>root===element||root.contains(element));for(let[element,view]of owned.reverse())views.delete(element),controls.delete(view.control),view.handle.dispose()}function content(node){if(node.nodeType===3)return node.textContent;if(node.nodeType!==1)return null;let props={};for(let{name,value}of node.attributes){let property=name==="class"?"className":name.startsWith("aria-")||name.startsWith("data-")?name:name.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());props[property]=value}return createElement(node.localName,props,...[...node.childNodes].map(content))}function icon(markup){let template=document.createElement("template");return template.innerHTML=markup,content(template.content.firstElementChild)}function mountAll(root){for(let original of root.querySelectorAll("button[data-studio-button]")){let props={type:"button"};for(let{name,value}of original.attributes)name!=="data-studio-button"&&(props[name==="class"?"className":name==="tabindex"?"tabIndex":name]=["disabled","autofocus","hidden"].includes(name)?!0:value);props.autofocus&&(props.autoFocus=!0,delete props.autofocus),props.appearance=original.dataset.studioButton||"secondary";let children=[...original.childNodes],icon2=children.find(node=>node.nodeType===1&&node.localName==="svg");icon2&&(props.icon=content(icon2)),props.children=createElement(toolkit.Fragment,null,...children.filter(node=>node!==icon2).map(content));let focused=original===document.activeElement,control=create(props);original.replaceWith(host(control)),focused&&control.focus({preventScroll:!0})}}function replace(root,html){clear(root),root.innerHTML=html,mountAll(root)}function dispose(){for(let element of[...views.keys()])clear(element)}return{renderButton:render,create,field,menu,split,segmented,renderComponent,actionGroup,host,append,update,setDisabled,setText,icon,clear,mountAll,replace,dispose}}var STUDIO_BUTTON_MOUNT_CSS=`
  :root[data-studio-theme="light"] { color-scheme: light; }
  :root[data-studio-theme="dark"] { color-scheme: dark; }
  .studio-button-mount, .studio-button-mount > .ct-provider,
  .studio-action-mount, .studio-action-mount > .ct-provider,
  .studio-segmented-mount > .ct-provider { display: contents; }
`;function mountStudioHome(element,{toolkit,AppList,artwork,onCreate,onOpen,onAssemble,onOpenRecent,appHref,onCopyPath,onRename,onDelete,appInventory=null,recentApps=null,recentError=null,recentLoading=!1,busy=!1}){let{createElement:h,mountCanvasComponent,SectionHeader,Button,SymbolIcon,FilterToolbar,Disclosure,useState}=toolkit,tasks=[{id:"new-app",title:"Create a new app",description:"Start from a guided template, including Sandboxes Minimal or Sandboxes + AI Gateway.",illustration:"create",onClick:onCreate},{id:"open-app",title:"Open an app",description:"Pick up where you left off.",illustration:"open",onClick:onOpen},{id:"assemble-app",title:"Assemble existing projects",description:"Combine source projects, ACA Sandboxes, and Azure resources.",illustration:"assemble",onClick:onAssemble}],questions=[["What makes up an app?","An app can include agents, tools, a web experience, and Azure resources. The App Map shows its components and connections; what is included depends on your template and configuration."],["How is tool execution isolated?","ACA Sandboxes can isolate tool execution from the agent. Local subprocess execution is a simulation, not that isolation boundary."],["How is shared access governed?","AI Gateway can govern access to shared models and tools. The controls that apply depend on your app's configuration; mapping a resource does not itself grant permission."],["How do I check that things work?","Review your connections, run a tool-backed task, and inspect the results and logs. These controls need to be configured and verified for each app."]];function AppPlatformHome({busy:currentBusy=busy,recentApps:currentApps=recentApps,appInventory:currentInventory=appInventory,recentError:currentError=recentError,recentLoading:currentLoading=recentLoading}={}){let[query,setQuery]=useState(""),normalizedQuery=query.trim().toLocaleLowerCase(),visibleApps=(currentApps||[]).filter(app=>(app.name+" "+app.path).toLocaleLowerCase().includes(normalizedQuery)).slice(0,5);return h("fieldset",{className:"simple-home",disabled:currentBusy,"aria-label":"App home","aria-busy":currentBusy},h("style",null,`
        :root { --home-art-light: block; --home-art-dark: none; }
        :root[data-studio-theme="dark"] { --home-art-light: none; --home-art-dark: block; }
        :root.studio-shared-presentation[data-theme-tone="light"],
        :root.studio-shared-presentation:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="light"] { --home-art-light: block; --home-art-dark: none; }
        :root.studio-shared-presentation[data-theme-tone="dark"],
        :root.studio-shared-presentation:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="dark"] { --home-art-light: none; --home-art-dark: block; }
        body:has(#studio-home) { padding-inline: 0; }
        body:has(#studio-home) .studio-site-nav { margin-inline: 0; }
        main:has(#studio-home) { padding-block: 0; }
        #studio-home { width: 100%; container: simple-home-shell / inline-size; }
        .simple-home { width: 100%; max-width: 888px; min-width: 0; box-sizing: border-box; border: 0; margin: 0 auto; padding: 24px; color: var(--canvas-fg); }
        .simple-home-start { display: grid; gap: 24px; container: simple-home / inline-size; }
        .simple-home-start > *, .simple-home-tasks > * { min-width: 0; }
        .simple-home-introduction h1 { margin: 0; font-size: var(--text-title-size, 20px); line-height: var(--text-title-line-height, 28px); font-weight: var(--font-weight-semibold, 600); }
        .simple-home-introduction p { margin: 8px 0 0; color: var(--canvas-muted); font-size: var(--canvas-body); line-height: 20px; font-weight: 400; }
        .simple-home-tasks { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
        .simple-home .simple-home-task.simple-home-task { display: grid; grid-template-columns: 84px minmax(0, 1fr); align-items: center; gap: 12px; width: 100%; height: 100%; min-height: 100px; padding: 12px; text-align: start; border: 1px solid var(--canvas-border); border-radius: var(--canvas-radius-large, 12px); background: var(--canvas-bg); color: var(--canvas-fg); }
        .simple-home .simple-home-task.simple-home-task:hover:not(:disabled) { background: var(--canvas-hover); }
        .simple-home-art { display: flex; justify-content: center; align-items: center; width: 84px; height: 74px; }
        .simple-home-art svg { display: block; width: 84px; height: 74px; }
        .simple-home-art [data-home-art-theme="light"] { display: var(--home-art-light); }
        .simple-home-art [data-home-art-theme="dark"] { display: var(--home-art-dark); }
        .simple-home-task-copy { display: grid; gap: 4px; min-width: 0; }
        .simple-home-task-title { font-size: var(--canvas-body); line-height: 20px; font-weight: var(--font-weight-semibold, 600); }
        .simple-home-task-description { color: var(--canvas-muted); font-size: var(--canvas-small); line-height: 18px; font-weight: 400; }
        .simple-home-recent { margin-top: 24px; padding: 20px; border: 1px solid var(--canvas-border); border-radius: var(--canvas-radius-large, 12px); }
        .simple-home-recent-heading { flex-wrap: wrap; }
        .simple-home .simple-home-browse.simple-home-browse { font-size: var(--canvas-small); }
        .simple-home-search { width: 100%; box-sizing: border-box; }
        .simple-home-search-toolbar { column-gap: 0; }
        .simple-home-results { display: grid; gap: 4px; margin-top: 8px; }
        .simple-home-help { margin-top: 24px; padding-top: 12px; border-top: 1px solid var(--canvas-border); }
        .simple-home-questions { padding-inline-start: 16px; }
        .simple-home-questions p { margin: 0 0 12px; max-width: 620px; color: var(--canvas-muted); font-size: var(--canvas-small); line-height: 20px; }
        @container simple-home-shell (max-width: 519px) {
          .simple-home { padding: 24px 16px; }
          .simple-home-recent { padding: 16px; }
        }
        @container simple-home (min-width: 640px) {
          .simple-home-tasks { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .simple-home-task:first-child:nth-last-child(odd) { grid-column: 1 / -1; }
        }
      `),h("div",{className:"simple-home-start"},h("div",{className:"simple-home-introduction"},h("h1",null,"What would you like to do?"),h("p",null,"Start a new app, bring existing projects together, or pick up where you left off.")),h("div",{className:"simple-home-tasks",role:"group","aria-label":"Ways to start"},...tasks.map(task=>h(Button,{key:task.id,id:task.id,className:"simple-home-task",type:"button","aria-label":task.title,disabled:currentBusy,onClick:task.onClick},h("span",{className:"simple-home-art","aria-hidden":!0},...["light","dark"].map(theme=>h("span",{key:theme,"data-home-art-theme":theme,dangerouslySetInnerHTML:{__html:artwork[task.illustration][theme].replaceAll('id="','id="home-'+task.illustration+"-"+theme+"-").replaceAll("url(#","url(#home-"+task.illustration+"-"+theme+"-").replaceAll('aria-labelledby="'+task.illustration+"-title "+task.illustration+'-description"','aria-hidden="true" focusable="false"')}}))),h("span",{className:"simple-home-task-copy"},h("span",{className:"simple-home-task-title"},task.title),h("span",{className:"simple-home-task-description"},task.description)))))),h("section",{className:"simple-home-recent","aria-labelledby":"recent-apps-title","aria-busy":currentLoading},h(SectionHeader,{className:"simple-home-recent-heading",title:h("span",{id:"recent-apps-title"},"Get back to your app"),actions:h(Button,{className:"simple-home-browse",type:"button",appearance:"subtle",icon:h(SymbolIcon,{name:"forward",size:16}),iconPosition:"after",disabled:currentBusy,onClick:onOpen},"Browse apps")}),h(FilterToolbar,{className:"simple-home-search-toolbar",search:{id:"recent-app-search",className:"simple-home-search",type:"search","aria-label":"Find a recent app",placeholder:"Find a recent app","aria-controls":"recent-app-results",value:query,onChange:(_,data)=>setQuery(data.value),disabled:currentBusy||currentApps===null}}),currentLoading&&currentApps!==null?h("p",{role:"status"},"Refreshing recent apps..."):null,currentError&&currentApps!==null?h("p",{role:"status"},"Recent apps could not be refreshed. Showing previously loaded apps. Use Open an app to retry."):null,h("div",{className:"simple-home-results",id:"recent-app-results","aria-live":"polite"},currentLoading&&currentApps===null?h("div",{className:"journey-loading"},h("p",{role:"status",className:"journey-progress"},h("span",{className:"journey-spinner","aria-hidden":!0}),"Finding your recent apps..."),h("div",{className:"journey-skeleton-stack","aria-hidden":!0},...[0,1,2].map(key=>h("div",{key,className:"journey-skeleton"},h("span"),h("span"))))):currentError&&currentApps===null?h("p",{role:"status"},"Recent apps could not be refreshed. Use Open an app to retry."):currentApps===null?h("p",null,"Recent apps have not been loaded. Use Open an app to find your existing apps."):currentApps.length===0?h("p",null,"No recently viewed apps were found."):visibleApps.length===0?h("p",{role:"status"},"No recent apps match. Try a different name or path."):h(AppList,{apps:visibleApps,inventory:currentInventory||currentApps,itemAttribute:"data-recent-app",appHref,onOpen:onOpenRecent,onCopyPath,onRename,onDelete,disabled:currentBusy,actionsDisabled:currentBusy||currentLoading}))),h("aside",{className:"simple-home-help","aria-label":"App guidance"},h(Disclosure,{title:"How apps work",keepMounted:!0},h("div",{className:"simple-home-questions"},...questions.map(([title,answer])=>h(Disclosure,{key:title,title,keepMounted:!0},h("p",null,answer)))))))}return mountCanvasComponent(element,AppPlatformHome)}import{LOCAL_TEMPLATES as LOCAL_TEMPLATES2}from"./source-catalog.mjs";var JOURNEY_LOADING_STYLES=`
  .journey-loading { display: grid; gap: 12px; padding: 16px; }
  .journey-loading p { margin: 0; color: var(--canvas-muted, var(--studio-muted)); }
  .journey-skeleton-stack:not([hidden]) { display: grid; gap: 12px; }
  .journey-skeleton { display: grid; gap: 10px; padding: 16px; border: 1px solid var(--canvas-border, var(--studio-line)); border-radius: 10px; }
  .journey-skeleton span { display: block; height: 12px; border-radius: 4px; background: var(--canvas-tint, var(--studio-raised)); }
  .journey-skeleton span:last-child { width: 65%; }
  .journey-progress { display: flex; align-items: center; gap: 8px; }
  .creation-progress { position: sticky; top: 8px; z-index: 1; margin-block: 12px; padding: 12px; border: 1px solid var(--canvas-border, var(--studio-line)); border-radius: 6px; background: var(--canvas-bg, var(--studio-panel)); }
  .journey-spinner { flex: none; width: 16px; height: 16px; border: 2px solid var(--canvas-border, var(--studio-line)); border-top-color: var(--canvas-accent, var(--studio-accent)); border-radius: 50%; animation: journey-spin 1s linear infinite; }
  @keyframes journey-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .journey-spinner, .ct-provider .journey-spinner { animation: journey-spin 1s linear infinite !important; }
  }
`;function renderJourneySkeleton(count=3){return'<div class="journey-skeleton-stack" aria-hidden="true">'+Array.from({length:count},()=>'<div class="journey-skeleton"><span></span><span></span></div>').join("")+"</div>"}async function readWorkspaceCreation(response,onProgress){let validateResult=result=>{if(!result||!(typeof result.worktreePath=="string"&&result.worktreePath.trim())&&result.outcome!=="workspace-requested")throw new Error("The workspace creation result was invalid.");return result};if(!response.ok||!response.headers.get("content-type")?.includes("application/x-ndjson"))try{let result=await response.json();if(!response.ok){let error=new Error(result.error||"Could not create the workspace.");throw error.creationFailed=!0,error}return validateResult(result)}catch(error){throw error.creationFailed||(error.creationOutcomeUnknown=!0),error}let reader=response.body?.getReader();if(!reader){let error=new Error("The workspace creation response was empty.");throw error.creationOutcomeUnknown=!0,error}let decoder=new TextDecoder,buffer="";try{for(;;){let{value,done}=await reader.read();buffer+=decoder.decode(value,{stream:!done});let lines=buffer.split(`
`);buffer=lines.pop(),done&&buffer.trim()&&(lines.push(buffer),buffer="");for(let line of lines){if(!line.trim())continue;let event=JSON.parse(line);if(event.type==="progress"&&typeof event.message=="string")onProgress(event.message);else{if(event.type==="result")return validateResult(event.result);if(event.type==="error"){let error=new Error(event.error);throw error.creationFailed=!0,error}else throw new Error("Invalid workspace progress response.")}}if(done)throw new Error("Creation outcome is unknown. Use Open an app to check before trying to create it again.")}}catch(error){throw error.creationFailed||(error.creationOutcomeUnknown=!0),error}finally{reader.releaseLock()}}function getAppPathLabels(paths){return new Map(paths.map(path=>{let parts=path.replace(/^[A-Za-z]:/,"").split(/[\\/]/).filter(Boolean),rootDepth=/^[\\/]{2}\?[\\/]UNC[\\/]/i.test(path)?4:/^[\\/]{2}[^\\/]/.test(path)?2:0;return[path,parts.length>rootDepth?parts.at(-1):path]}))}function getAppOpenedLabel(value,now=Date.now()){if(typeof value!="string"||!Number.isFinite(Date.parse(value)))return"";let minutes=Math.floor(Math.max(0,now-Date.parse(value))/6e4);return minutes===0?"opened just now":minutes<60?"opened "+minutes+"m ago":minutes<1440?"opened "+Math.floor(minutes/60)+"h ago":"opened "+Math.floor(minutes/1440)+"d ago"}function createStudioAppList(toolkit,{getAppPathLabels:getAppPathLabels2,getAppOpenedLabel:getAppOpenedLabel2}){let{createElement:h,Fragment,useState,useEffect,useRef,MenuButton,MenuItem,Tooltip}=toolkit;function AppRow({app,pathLabel,openedLabel,appHref,itemAttribute,onOpen,onCopyPath,onRename,onDelete,disabled,actionsDisabled=disabled}){let trigger=useRef(null);return h("li",{className:"app-list-row"},h(Tooltip,{content:h("span",{className:"app-list-full-path"},app.path)},h("a",{className:"app-list-target",href:appHref(app.path),[itemAttribute]:app.path,"aria-label":app.name,"aria-disabled":disabled||void 0,tabIndex:disabled?-1:0,onClick:event=>{if(disabled){event.preventDefault();return}onOpen&&(event.preventDefault(),onOpen(app.path))},onKeyDown:event=>{if(event.key!=="Escape")return;let popup=event.currentTarget.ownerDocument.getElementById(event.currentTarget.getAttribute("aria-describedby"));popup?.matches(":popover-open")&&(popup.hidePopover(),event.preventDefault(),event.stopPropagation())}},h("strong",{className:"app-list-name",title:app.name},app.name),h("span",{className:"app-list-metadata"},h("span",{className:"app-list-path"},pathLabel),openedLabel?h("time",{className:"app-list-opened",dateTime:app.lastOpenedAt,title:new Date(app.lastOpenedAt).toLocaleString()},"\u2022 "+openedLabel):null))),h(MenuButton,{label:null,positioning:"below-end",button:{ref:trigger,appearance:"subtle",size:"small",disabled:actionsDisabled,icon:h("span",{"aria-hidden":!0},"\u22EF"),"aria-label":"More actions for "+app.name,"data-app-actions":app.path}},h(MenuItem,{onClick:()=>onCopyPath(app.path)},"Copy full path"),h(MenuItem,{onClick:()=>onRename(app.path,app.name,trigger.current)},"Rename app"),h(MenuItem,{onClick:()=>onDelete(app.path,app.name,trigger.current)},h("span",{className:"app-list-delete"},"Delete app"))))}return function({apps,inventory=apps,id,itemAttribute="data-existing-app",...rowProps}){let[now,setNow]=useState(Date.now());useEffect(()=>{let timer=setInterval(()=>setNow(Date.now()),6e4);return()=>clearInterval(timer)},[]);let pathLabels=getAppPathLabels2(inventory.map(app=>app.path));return h(Fragment,null,h("style",null,`
        .app-list { list-style: none; margin-block: 8px; padding: 0; }
        .app-list-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 8px; padding: 8px; border: 0; }
        .app-list-row:hover, .app-list-row:focus-within { background: var(--studio-panel); }
        .app-list-target { display: grid; gap: 2px; min-width: 0; color: var(--studio-ink); text-decoration: none; }
        .app-list-target:focus-visible { outline: 2px solid var(--color-focus-outline, #0969da); outline-offset: 3px; border-radius: 2px; }
        .app-list-name { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; font-size: 13px; font-weight: 600; line-height: 18px; overflow-wrap: anywhere; }
        .app-list-metadata { display: flex; align-items: baseline; gap: 4px; min-width: 0; color: var(--studio-muted); font-size: 12px; line-height: 18px; }
        .app-list-path { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .app-list-opened { flex: none; white-space: nowrap; }
        .app-list-full-path { display: block; max-width: min(360px, calc(100vw - 40px)); overflow-wrap: anywhere; }
        [role="tooltip"]:has(.app-list-full-path) { border: 0; }
        .app-list-delete { color: var(--studio-danger); }
      `),h("ul",{className:"app-list",id},...apps.map(app=>h(AppRow,{key:app.path,app,pathLabel:pathLabels.get(app.path),openedLabel:getAppOpenedLabel2(app.lastOpenedAt,now),itemAttribute,...rowProps}))))}}function mountStudioOpenApps(element,{toolkit,AppList,...props}){let{createElement:h,mountCanvasComponent,useState,useRef,Button,TextInput}=toolkit;function OpenApps({apps,initialSearch="",onSearchChange,appHref,onCopyPath,onRename,onDelete,onCreate,onRetry,emptyIllustrations,loadError=null,loading=!1,loadingSkeleton="",disabled=!1}){let[query,setQuery]=useState(initialSearch),search=useRef(null),filtered=apps.filter(app=>(app.name+" "+app.path).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));function changeSearch(value){setQuery(value),onSearchChange(value)}return h("section",{className:"open-apps","aria-label":"Existing apps"},h("style",null,`
        .open-apps { --open-app-art-light-display: block; --open-app-art-dark-display: none; }
        :root[data-studio-theme="dark"] .open-apps,
        :root.studio-shared-presentation[data-theme-tone="dark"] .open-apps,
        :root.studio-shared-presentation:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="dark"] .open-apps {
          --open-app-art-light-display: none; --open-app-art-dark-display: block;
        }
        :root.studio-shared-presentation[data-theme-tone="light"] .open-apps,
        :root.studio-shared-presentation:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="light"] .open-apps {
          --open-app-art-light-display: block; --open-app-art-dark-display: none;
        }
        .open-app-search { display: flex; align-items: center; gap: 8px; margin-block: 16px 8px; }
        .open-app-search > :first-child { flex: 1; min-width: 0; }
        .open-app-count { color: var(--studio-muted); font-size: 12px; }
        .open-app-empty { margin-top: 16px; }
        .open-app-recovery { margin-top: 16px; }
        .open-app-recovery h2 { margin-top: 0; }
        .open-app-welcome { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; min-height: min(560px, calc(100svh - 160px)); padding: 24px 12px 40px; text-align: center; }
        .open-app-welcome h1 { margin: 0; max-width: 22ch; font-size: var(--text-title-size, 20px); line-height: var(--text-title-line-height, 28px); font-weight: var(--font-weight-semibold, 600); }
        .open-app-welcome p { margin: 0; max-width: 34ch; text-wrap: pretty; }
        .open-app-welcome > button { margin-top: 4px; }
        .open-app-empty-art { width: min(224px, 100%); flex: none; }
        .open-app-empty-art [data-open-app-art-theme="light"] { display: var(--open-app-art-light-display); }
        .open-app-empty-art [data-open-app-art-theme="dark"] { display: var(--open-app-art-dark-display); }
        .open-app-empty-art svg { display: block; width: 100%; height: auto; }
        @media (max-height: 600px) {
          .open-app-welcome { min-height: 0; gap: 8px; padding-block: 12px; }
          .open-app-empty-art { width: min(160px, 100%); }
        }
      `),apps.length>0||query?h("div",{className:"open-app-search"},h(TextInput,{ref:search,type:"search",placeholder:"Search apps by name or path","aria-label":"Search apps","aria-controls":"open-app-list",value:query,disabled:disabled||!!loadError,onChange:(_event,data)=>changeSearch(data.value)}),query?h(Button,{appearance:"subtle",disabled:disabled||!!loadError,onClick:()=>{changeSearch(""),search.current?.focus()}},"Clear search"):null):null,loading?h("p",{className:"journey-progress",role:"status"},h("span",{className:"journey-spinner","aria-hidden":!0}),"Finding your apps..."):null,loadError&&!loading?h("div",{className:"open-app-recovery"},h("h2",null,"Apps could not be loaded"),h("p",{role:"alert"},loadError),h(Button,{id:"retry-apps",appearance:"primary",disabled,onClick:onRetry},"Retry")):null,loading&&apps.length===0?h("div",{"aria-busy":!0,"aria-label":"App list",dangerouslySetInnerHTML:{__html:loadingSkeleton}}):!loadError&&apps.length===0?h("div",{className:"open-app-welcome"},h("div",{className:"open-app-empty-art","aria-hidden":!0},...["light","dark"].map(theme=>h("span",{key:theme,"data-open-app-art-theme":theme,dangerouslySetInnerHTML:{__html:emptyIllustrations[theme]}}))),h("h1",null,"Your next app starts here"),h("p",null,"Start with a template and make it your own."),h(Button,{appearance:"primary",disabled,onClick:onCreate},"Create an app")):apps.length>0?h(toolkit.Fragment,null,h("div",{className:"open-app-count",role:"status","aria-live":"polite","aria-atomic":!0},query.trim()?filtered.length+" of "+apps.length+" apps":apps.length+(apps.length===1?" app":" apps")),h(AppList,{id:"open-app-list",apps:filtered,inventory:apps,appHref,onCopyPath,onRename,onDelete,disabled,actionsDisabled:disabled||loading}),filtered.length===0?h("p",{className:"open-app-empty"},"No apps match your search."):null):null)}return mountCanvasComponent(element,OpenApps,props)}function showAppRenameDialog({root,name,request,buttons,returnFocus=document.activeElement}){return new Promise(resolve6=>{let dialog=document.createElement("dialog");dialog.className="app-rename-dialog",buttons.replace(dialog,'<form><h2 id="app-rename-title">Rename app</h2><p id="app-rename-description">Changes the display name only. The folder, Git names, and Azure resources stay unchanged.</p><div data-rename-field></div><p role="alert" class="app-rename-error"></p><div class="app-rename-actions"><button type="button" data-studio-button="secondary" data-rename-cancel>Cancel</button><button type="submit" data-studio-button="primary" data-rename-save>Save</button></div></form>'),dialog.setAttribute("aria-labelledby","app-rename-title"),dialog.setAttribute("aria-describedby","app-rename-description");let style=document.createElement("style");style.textContent=`
      .app-rename-dialog { box-sizing:border-box; position:fixed; inset:0; margin:auto; width:min(420px, calc(100vw - 32px)); max-height:calc(100dvh - 32px); overflow:auto; padding:20px; border:1px solid var(--studio-line); border-radius:var(--studio-dialog-radius, 8px); background:var(--studio-raised); color:var(--studio-ink); font:13px/1.5 var(--font-sans, system-ui, sans-serif); }
      .app-rename-dialog::backdrop { background:rgb(0 0 0 / .4); }
      .app-rename-dialog h2 { margin:0 0 12px; font-size:18px; }
      .app-rename-dialog p { color:var(--studio-muted); overflow-wrap:anywhere; }
      .app-rename-dialog .app-rename-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
      .app-rename-dialog .app-rename-error { color:var(--studio-danger); }
      .app-rename-dialog .app-rename-error:empty { display:none; }
    `,dialog.append(style),document.body.append(dialog);let input=buttons.field({kind:"TextInput",label:"App name","aria-label":"App name",defaultValue:name,maxLength:80,required:!0,autoComplete:"off"});buttons.append(dialog.querySelector("[data-rename-field]"),input);let cancel=dialog.querySelector("[data-rename-cancel]"),save=dialog.querySelector("[data-rename-save]"),error=dialog.querySelector('[role="alert"]'),busy=!1,result=null;cancel.addEventListener("click",()=>dialog.close()),dialog.addEventListener("cancel",event=>{busy&&event.preventDefault()}),dialog.addEventListener("keydown",event=>{if(event.key==="Escape"&&event.stopPropagation(),event.key!=="Tab")return;let targets=[input,cancel,save].filter(target=>!target.disabled);if(!targets.length){event.preventDefault();return}event.preventDefault();let index=targets.indexOf(document.activeElement);targets[(index+(event.shiftKey?-1:1)+targets.length)%targets.length].focus()}),dialog.addEventListener("close",()=>{buttons.clear(dialog),dialog.remove(),returnFocus?.isConnected&&returnFocus.focus({preventScroll:!0}),resolve6(result)},{once:!0}),dialog.querySelector("form").addEventListener("submit",async event=>{if(event.preventDefault(),busy)return;let nextName=input.value.trim();if(!nextName){error.textContent="App name is required.",input.focus();return}busy=!0,buttons.update(input,{disabled:!0}),buttons.update(cancel,{disabled:!0}),buttons.update(save,{disabled:!0,children:"Saving..."}),error.textContent="";try{let renamed=await request("/api/rename-app",{method:"POST",body:JSON.stringify({root,name:nextName})});if(typeof renamed?.name!="string"||!renamed.name.trim())throw new Error("Canvas returned an invalid app name.");result=renamed.name,dialog.close()}catch(cause){error.textContent="Could not rename app: "+cause.message,busy=!1,buttons.update(input,{disabled:!1}),buttons.update(cancel,{disabled:!1}),buttons.update(save,{disabled:!1,children:"Save"}),input.focus()}}),dialog.showModal(),input.focus(),input.select()})}var CREATE_GUIDANCE={sandboxMinimal:{introduction:"An agent uses a sandboxed tool; local execution is a process simulation, not cloud isolation.",caution:"The local tool process is a simulation, not the ACA Sandboxes isolation boundary.",worksFirst:"Run document checks locally without provisioning cloud resources.",run:"The starter runs its agent and tool locally. Configure ACA Sandboxes separately for isolated cloud execution.",later:"Configure an ACA Sandbox Group and egress policy when cloud isolation is needed.",boundaries:"Local subprocess execution is not OS isolation. Creating the starter does not provision ACA Sandboxes or an egress proxy.",included:[["Agent","Orchestrates document checks on the selected compute."],["Document validation tool","Checks supported text and Markdown input; local execution is a process simulation."],["Sandbox configuration","Documents the optional ACA Sandbox Group and egress policy setup."]],excluded:"No provisioned ACA Sandbox Group, egress proxy, Hosted Skill, or AI Gateway.",editing:"Used by the configured app agent. This text does not change document checks, supported formats, safety policy, or implement new tools.",flow:["Validate a supported text document","Check the bounded tool result","Configure ACA Sandboxes separately for isolated cloud execution"],files:[["src/agent/prompts/system.md","Instructions used by the configured app agent"],["src/tools/document-validation/contract.json","Supported files, input limits and schemas"],["config/runtime.json","Local or separately configured cloud runtime"]]},sandbox:{introduction:"An agent uses document checks and governed model access; local execution is a process simulation, not cloud isolation.",caution:"Local execution is a process simulation, not cloud isolation.",worksFirst:"Test text and Markdown checks locally without a model connection.",run:"AI replies require a configured AI Gateway endpoint and credentials. Missing configuration fails rather than returning a fake answer.",later:"Configure ACA sandboxes separately if cloud isolation is needed; creating the starter does not provision them.",boundaries:"Default local mode launches the tool as a child process. Optional ACA sandbox execution needs separate configuration; copilot-sdk-sandbox uses separate configured HTTPS agent and tool pools. The model stays remote behind AI Gateway. Focused policy checks are not complete PII, malware or prompt-injection protection.",included:[["Agent","Orchestrates document checks and configured model calls."],["Document validation tool","Checks bounded text and Markdown input; local execution is a process simulation."],["AI Gateway configuration","Model routing configuration; requires a gateway endpoint and credentials."]],excluded:"No web frontend, Hosted Skill, provisioned gateway or cloud sandbox pools.",editing:"Used by the configured app agent. This text does not change document checks, supported formats or safety policy, and does not implement new tools.",flow:["Validate a supported text document","Independently check the bounded, sanitized tool result","Send approved document text to a remote model through configured AI Gateway","Check the model response before returning it"],files:[["src/agent/prompts/system.md","Instructions used by the configured app agent"],["src/tools/document-validation/contract.json","Supported files, input limits and schemas"],["src/policy/enforcement.py","Deterministic policy implementation"],["config/runtime.json","Local or separately configured cloud runtime"]]},web:{introduction:"Custom instructions are optional: leave them blank for the clean Fluent 2 Vite starter, or add an app idea, stack, or theme for customization.",caution:"Blank instructions create the default starter; custom instructions start an automatic agent customization pass after materialization.",worksFirst:"Build and preview the default Fluent 2 Vite page locally without a model or backend.",run:"Use Node.js and npm to build and preview the page locally. No model connection or backend service is needed.",later:"Add backend capabilities when needed, then deploy explicitly. Hosted Skills are an optional extension, not included or already connected.",boundaries:"Leaving instructions blank materializes the Fluent 2 Vite starter with builder.yaml, /health, and a sample environment variable. Custom instructions run a separate code customization pass; neither path deploys Azure resources or adds a backend.",included:[["Web frontend","Fluent 2 Vite and TypeScript page with builder.yaml, /health, and a sample environment variable."]],excluded:"No app agent, backend, Hosted Skill or provisioned hosting.",editing:'Optional. Leave blank for the default Vite starter, or enter a stack, theme, or app idea such as "Create a todo app" to customize it automatically with the bundled Fluent theme and spot illustration skills.',flow:["Materialize the default Fluent 2 Vite starter","Optionally run agent customization from your instructions","Build static assets into dist","Deploy explicitly through App Service Builder when ready"],files:[["src/main.ts","Greeting and displayed description"],["index.html","Minimal page structure"],["builder.yaml","Static hosting deployment contract"],["static.test.mjs","Static-site smoke tests"]]},webGateway:{introduction:"A Python FastAPI and Microsoft Agent Framework chat app on App Service Builder with governed model routing through AI Gateway.",caution:"Live AI replies require a configured AI Gateway endpoint and credentials; local UI and /health run without them.",worksFirst:"Start the FastAPI web app and chat UI locally; /health reports gateway readiness.",run:"Connect an AI Gateway in Run mode or configure .env to enable live streaming chat responses.",later:"Deploy the web app through App Service Builder (builder.yaml) once your gateway and instructions are ready.",boundaries:"FastAPI serves both the chat UI and /api/chat/stream on one App Service Builder web entrypoint. Model calls route through Azure AI Gateway using the OpenAI Responses API.",included:[["Web & Agent app","FastAPI + Microsoft Agent Framework streaming chat app with builder.yaml."],["AI Gateway configuration","Governed model routing via Azure AI Gateway."]],excluded:"No ACA sandbox pool, Hosted Skill, or pre-provisioned cloud gateway.",editing:"Saved as the system prompt in config/domain.json and used by the Agent Framework chat endpoint.",flow:["Browser UI posts to /api/chat/stream","FastAPI agent streams responses via AI Gateway","Deploy with App Service Builder (builder.yaml)"],files:[["app.py","FastAPI + Agent Framework streaming chat server"],["gateway.py","AI Gateway client and credential setup"],["builder.yaml","App Service Builder deployment contract"],["config/domain.json","Editable app purpose and agent instructions"]]},basic:{introduction:"An empty app blueprint with four optional components; the included scaffold uses a mock agent and an unimplemented tool.",caution:"The agent is a mock; the included backend tool is unimplemented.",worksFirst:"Preview the web form and its fixed mock response without model credentials.",run:"Azure Functions Core Tools is needed to start the included Hosted Skill; its invoke endpoint returns HTTP 501 until implemented.",later:"Implement the Hosted Skill, replace or extend the mock agent, and connect real services explicitly.",boundaries:"The mock agent does not read saved instructions, call a model or execute the skill. Implement that behavior and wire the tool explicitly. A Hosted Skill is the included Azure Functions backend tool. The gateway folder is a configuration placeholder, not a provisioned gateway.",included:[["Web frontend","Web form with a mock-agent connection."],["Mock agent","Returns a fixed response; real agent behavior needs implementation."],["Hosted Skill stub","Azure Functions tool; returns HTTP 501 until implemented."],["AI Gateway placeholder","Configuration scaffold, not a provisioned gateway."]],excluded:"No live AI agent, implemented business tool, provisioned gateway or credentials.",editing:"The mock agent does not read these instructions. They are saved for the agent behavior you implement; tools still need code and explicit connections.",flow:["Local web form calls the mock agent","Mock agent returns a fixed response","Implement and connect the separate skill and model access"],files:[["src/agent/prompts/system.md","Saved instructions for the agent behavior you implement"],["src/skills/<your-skill>/function_app.py","Backend-tool implementation stub"],["src/web/server.mjs","Web form and mock-agent proxy"],["infra-ai-gateway/README.md","Gateway configuration placeholder"]]},sample:{introduction:"A dealership reference connects web flows, an agent, tools and AI Gateway; real integrations need configuration.",caution:"Copies dealership behavior unchanged; renaming does not change its domain.",worksFirst:"Explore the dealership's credential-free mock preview.",run:"Full AI and tool integrations require the reference's documented services and configuration.",later:"Configure full integrations to use real services. Adapting the example to your own domain is a separate coding task.",boundaries:"Create copies the eligible pinned reference commit as a whole. Configuration, tests and docs stay together. Changing the workspace name does not rewrite dealership behavior or deploy services.",included:[["Web frontend","Buyer and dealer reference flows."],["Agent","Deal-finder reference implementation."],["Hosted Skills","Four example business tools."],["Sandbox examples","Reference sandbox execution examples."],["AI Gateway configuration","Configured model access; real services require credentials."],["Workflows","Reference durable workflow examples."]],excluded:"No rewrite to your business domain and no newly provisioned Azure resources.",editing:"The sample's domain behavior is copied unchanged. Changing this description or the app name does not rewrite it.",flow:["Buyer/dealer web flows","Deal-finder app agent","Four business tools, sandbox and workflow examples","Configured model access through AI Gateway"],files:[["src/web","Buyer and dealer interface source"],["src/agent","Reference app-agent implementation"],["src/skills","Four example business tools"],["scripts/dev-start.*","Reference setup and mock startup"]]}};function createTemplateKind(template){if(template.id==="builtin-sandboxes-minimal-v1")return"sandboxMinimal";if(template.id==="builtin-sandbox-gateway-minimal-v1")return"sandbox";if(template.id==="builtin-app-service-builder-ai-gateway-v1")return"webGateway";if(template.id==="builtin-app-service-builder-vite-v1")return"web";if(template.id==="builtin-empty-starter-v1")return"basic";if(template.kind==="sample")return"sample";throw new Error("No Create guidance is registered for template "+template.id)}function renderCreateProgress(step){return'<ol class="create-progress" aria-label="Create progress">'+["Choose a template","Describe app","Review app"].map((label,index)=>"<li"+(step===index+1?' aria-current="step"':"")+'><span class="create-step-number">'+(index+1)+"</span><span>"+label+"</span></li>").join("")+"</ol>"}var CREATE_FLOW_CSS=`
  .create-progress { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; gap: 16px; width: 100%; max-width: 640px; margin: 0 0 18px; padding: 0; list-style: none; font-size: 12px; container: create-progress / inline-size; }
  .create-progress li { position: relative; display: flex; align-items: center; gap: 8px; min-width: 0; color: var(--studio-muted); }
  .create-progress li > span:last-child { min-width: 0; overflow-wrap: anywhere; }
  .create-progress li + li::before { content: ""; width: 24px; height: 1px; flex: none; background: var(--studio-line); margin-right: 4px; }
  .create-progress [aria-current] { color: var(--studio-ink); }
  .create-step-number { display: grid; place-items: center; width: 24px; height: 24px; flex: none; border: 1px solid var(--studio-line); border-radius: 50%; font-variant-numeric: tabular-nums; line-height: 1; }
  .create-progress [aria-current] .create-step-number { background: var(--canvas-selected, var(--studio-accent-soft)); border-color: var(--studio-accent); }
  @container create-progress (max-width: 520px) {
    .create-progress li { flex-direction: column; align-items: flex-start; gap: 6px; }
    .create-progress li + li::before { display: none; }
    .create-progress li:not(:last-child)::after { content: ""; position: absolute; top: 12px; left: 32px; right: 0; height: 1px; background: var(--studio-line); }
  }
  .create-selection { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; gap: 16px; }
  .create-selection > [data-create-context] { align-self: stretch; display: flex; flex-direction: column; min-width: 0; }
  [data-create-context] > .create-starter-panel { flex: 1; }
  .create-selection[data-narrow] { grid-template-columns: minmax(0, 1fr); }
  @media (min-width: 1100px) {
    main:has(.create-selection) { width: min(100%, 1280px); }
    .create-selection { grid-template-columns: minmax(0, 420px) minmax(0, 1fr); }
  }
  .create-configure, .create-review { max-width: 640px; }
  .create-configure-context { font-size: 12px; color: var(--studio-muted); }
  .create-choices { border: 0; min-width: 0; display: grid; gap: 8px; }
  .create-choices > legend { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .create-template { min-width: 0; border: 1px solid var(--studio-line); border-radius: var(--canvas-radius-surface, 6px); overflow-wrap: anywhere; }
  .create-template:has(input:checked) { border-color: var(--studio-accent); background: var(--canvas-selected, var(--studio-accent-soft)); }
  .create-template .template { border: 0; border-radius: inherit; background: transparent; box-shadow: none; padding: 12px; }
  .create-template .template:has(input:checked) { box-shadow: none; }
  .create-template .template strong { font-weight: 500; }
  [data-create-inline][hidden], [data-create-context][hidden] { display: none !important; }
  [data-create-inline] { border-top: 1px solid var(--studio-line); }
  .create-starter-panel { min-width: 0; padding: 14px; border: 1px solid var(--studio-line); border-radius: var(--canvas-radius-surface, 6px); background: var(--studio-raised); }
  .create-caution, .create-field-help { font-size: 12px; line-height: 18px; margin: 10px 0; color: var(--studio-muted); }
  .create-caution { border-left: 2px solid var(--studio-warn); padding-left: 8px; color: var(--studio-ink); }
  .create-inline-body .create-starter-panel { padding: 12px; border: 0; border-radius: 0; }
  .create-selection .create-footer { border: 0; margin-top: 12px; padding-top: 0; }
  .create-selection .create-footer > p { display: none; }
  .create-starter-heading { margin: 0 0 12px; font-size: 14px; line-height: 20px; font-weight: 600; }
  .create-footer { border-top: 1px solid var(--studio-line); margin-top: 16px; padding-top: 12px; }
  .create-footer > p { font-size: 12px; line-height: 18px; margin-bottom: 8px; }
  .create-footer .actions { margin-top: 8px; flex-wrap: wrap; }
  .create-selection .create-footer .actions { flex-direction: row; align-items: center; flex-wrap: nowrap; gap: 8px; }
  .create-selection .create-footer .actions-right { width: auto; flex-direction: row; }
  .create-selection .create-footer .actions button { width: auto; }
  .create-form { min-width: 0; }
  .create-form .field:first-child { margin-top: 0; }
  .create-form textarea { min-height: 96px; }
  .create-starter-panel > figure { margin: 0; }
  .create-diagram { margin-top: 12px; padding: 8px; border: 1px solid var(--studio-line); border-radius: var(--canvas-radius-surface, 6px); background: var(--studio-raised); }
  .create-diagram svg { display: block; width: 100%; height: auto; }
  .create-diagram-relationships { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .create-review-copy { overflow-wrap: anywhere; }
  .create-review-copy .summary { gap: 12px; }
  .create-review-copy .summary p { margin-bottom: 0; white-space: pre-wrap; }
  .create-review-capabilities { margin: 8px 0 0; display: grid; gap: 10px; }
  .create-review-capabilities > div { margin: 0; padding-left: 10px; border-left: 2px solid var(--studio-line); }
  .create-review-capabilities dt { font-size: 13px; line-height: 18px; font-weight: 500; color: var(--studio-ink); }
  .create-review-capabilities dd { color: var(--studio-muted); font-size: 12px; line-height: 18px; margin: 2px 0 0; }
  .create-field-error { color: var(--studio-danger); font-size: 12px; line-height: 18px; margin: 0; }
  .create-form [aria-invalid="true"] { border-color: var(--studio-danger); }
`;function mountCreateFlow({root,toolkit,buttons,current,guidanceFor,preview,kindFor,step,onError}){let escape=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[char]),layout=root.querySelector(".create-selection, .create-configure"),contextMount=root.querySelector("[data-create-context]"),footer=root.querySelector(".create-footer"),panel,inlineMount,disposed=!1,originalDiagram;function sync(){if(disposed||!panel)return;let narrow=layout.clientWidth<=620,focused=document.activeElement,retainFocus=panel.contains(focused)||footer?.contains(focused);narrow?layout.dataset.narrow="":delete layout.dataset.narrow;let destination=narrow?inlineMount:contextMount;panel.parentElement!==destination&&destination.append(panel),step===1&&footer&&footer.parentElement!==panel&&panel.append(footer),contextMount.hidden=narrow,inlineMount.hidden=!narrow,retainFocus&&document.activeElement!==focused&&focused.focus({preventScroll:!0}),refreshDiagram()}function blueprintNodes(svg){let rectangles=[...svg.querySelectorAll("rect")],texts=[...svg.querySelectorAll("text")];return rectangles.map(rect=>({rect,texts:texts.filter(text=>{let x=Number(text.getAttribute("x")),y=Number(text.getAttribute("y"));return rectangles.filter(box=>x>=Number(box.getAttribute("x"))&&x<=Number(box.getAttribute("x"))+Number(box.getAttribute("width"))&&y>=Number(box.getAttribute("y"))&&y<=Number(box.getAttribute("y"))+Number(box.getAttribute("height"))).sort((a,b)=>Number(a.getAttribute("width"))*Number(a.getAttribute("height"))-Number(b.getAttribute("width"))*Number(b.getAttribute("height")))[0]===rect})}))}function blueprintEdges(kind){return kind==="basic"?[]:kind==="sandbox"?[[0,1],[0,2]]:kind==="web"||kind==="webGateway"?[[0,1]]:[[0,1],[1,2],[1,3],[1,4]]}function diagram(source,stage,kind){let svg=source.cloneNode(!0),ns="http://www.w3.org/2000/svg",colors={"#ffffff":"var(--studio-raised)","#f8fafc":"var(--studio-panel)","#f5f7ff":"var(--canvas-selected, var(--studio-accent-soft))","#f0fdfa":"var(--canvas-selected, var(--studio-accent-soft))","#94a3b8":"var(--studio-line)","#cbd5e1":"var(--studio-line)","#a5b4fc":"var(--studio-accent)","#5eead4":"var(--studio-accent)","#93c5fd":"var(--studio-accent)","#1e3a8a":"var(--studio-accent)","#312e81":"var(--studio-accent)","#0f766e":"var(--studio-accent)","#1d4ed8":"var(--studio-accent)","#334155":"var(--studio-ink)","#1e293b":"var(--studio-ink)","#475569":"var(--studio-muted)","#64748b":"var(--studio-muted)"};for(let element of svg.querySelectorAll("*")){for(let attr of["fill","stroke"])colors[element.getAttribute(attr)]&&element.setAttribute(attr,colors[element.getAttribute(attr)]);element.hasAttribute("font-family")&&element.setAttribute("font-family","var(--font-sans, sans-serif)"),element.getAttribute("font-weight")==="700"&&element.setAttribute("font-weight","600")}if(stage.replaceChildren(svg),stage.clientWidth>=560){stage.dataset.diagramLayout="horizontal";for(let{rect,texts}of blueprintNodes(svg))for(let text of texts){let available=Number(rect.getAttribute("x"))+Number(rect.getAttribute("width"))-Number(text.getAttribute("x"))-8,measured=text.getBBox().width;measured>available&&text.setAttribute("font-size",Number(text.getAttribute("font-size"))*available/measured)}return svg}stage.dataset.diagramLayout="compact";let width=Math.min(stage.clientWidth,560);if(width<=0)return svg;let measure=document.createElement("canvas").getContext("2d");if(!measure)throw Error("Text measurement is unavailable for the starter diagram.");let nodes=blueprintNodes(svg),boxes=[],font=getComputedStyle(stage).fontFamily;function plan(node,x,y,w){let lines=node.texts.map((text,index)=>{let size=index?12:14,height2=index?18:20,wrapped=[];measure.font=`${text.getAttribute("font-weight")||"400"} ${size}px ${font}`;let line="";for(let word of text.textContent.split(/\s+/))line&&measure.measureText(line+" "+word).width>w-24?(wrapped.push(line),line=word):line+=(line?" ":"")+word;return line&&wrapped.push(line),{text,size,height:height2,wrapped}}),box={node,x,y,w,h:24+lines.reduce((sum,line)=>sum+line.height*line.wrapped.length,0),lines};return boxes.push(box),box}let height;if(kind==="basic"){let workspace=plan(nodes[0],8,8,width-16),cardWidth=(width-52)/2,y=workspace.y+workspace.h;for(let index=1;index<nodes.length;index+=2){let row=nodes.slice(index,index+2).map((node,column)=>plan(node,20+column*(cardWidth+12),y,cardWidth)),h=Math.max(...row.map(box=>box.h));row.forEach(box=>box.h=h),y+=h+12}workspace.h=y-workspace.y,height=y+8}else if(kind==="sample"){let w=(width-56)/2,roots=nodes.slice(0,2).map((node,index)=>plan(node,16+index*(w+24),8,w)),h=Math.max(...roots.map(box=>box.h));roots.forEach(box=>box.h=h);let y=8+h+24;for(let node of nodes.slice(2)){let box=plan(node,16,y,width-32);y+=box.h+12}height=y-4}else{let y=8;for(let node of nodes){let box=plan(node,16,y,width-32);y+=box.h+24}height=y-16}let make=(name,attrs)=>{let element=document.createElementNS(ns,name);for(let[key,value]of Object.entries(attrs))element.setAttribute(key,value);return element};svg.replaceChildren(),svg.setAttribute("viewBox",`0 0 ${width} ${height}`);for(let[fromIndex,toIndex]of blueprintEdges(kind)){let from=boxes[fromIndex],to=boxes[toIndex],fy=from.y+from.h/2,ty=to.y+to.h/2,isTwoBox=kind==="web"||kind==="webGateway",d=from.y===to.y?`M${from.x+from.w} ${fy}H${to.x}`:isTwoBox?`M${from.x+from.w/2} ${from.y+from.h}V${to.y}`:`M${from.x+from.w} ${fy}H${width-8}V${ty}H${to.x+to.w}`;if(svg.append(make("path",{d,fill:"none",stroke:"var(--studio-muted)","stroke-width":1.4,...kind==="web"?{"stroke-dasharray":"4 3"}:{}})),kind!=="sample"){let x=isTwoBox?to.x+to.w/2:to.x+to.w,y=isTwoBox?to.y:ty;svg.append(make("path",{d:isTwoBox?`M${x-3} ${y-5}L${x} ${y}L${x+3} ${y-5}`:`M${x+5} ${y-3}L${x} ${y}L${x+5} ${y+3}`,fill:"none",stroke:"var(--studio-muted)","stroke-width":1.4}))}}for(let{node,x,y,w,h,lines}of boxes){let rect=node.rect.cloneNode(!0);for(let[key,value]of Object.entries({x,y,width:w,height:h}))rect.setAttribute(key,value);svg.append(rect);let baseline=y+12;for(let line of lines){let text=line.text.cloneNode(!1);text.setAttribute("x",x+12),text.setAttribute("y",baseline+line.size),text.setAttribute("font-size",line.size),line.wrapped.forEach((value,index)=>{let span=make("tspan",{x:x+12,y:baseline+line.size+index*line.height});span.textContent=value+(index<line.wrapped.length-1?" ":""),text.append(span)}),svg.append(text),baseline+=line.height*line.wrapped.length}}return svg}function renderInlineDiagram(template,kind){let source=document.createElement("div");source.innerHTML=preview(template);let original=source.querySelector("svg");if(!original){onError("The starter diagram is unavailable.");return}let nodes=blueprintNodes(original),label=index=>nodes[index].texts[0].textContent,relationships=kind==="basic"?nodes.slice(1).map((_node,index)=>label(0)+" contains "+label(index+1)+"."):blueprintEdges(kind).map(([from,to])=>label(from)+" to "+label(to)+": "+(kind==="web"?"optional connection.":"blueprint relationship.")),figure=document.createElement("figure");figure.innerHTML='<div class="create-diagram"></div><ol class="create-diagram-relationships" aria-label="Blueprint relationships">'+relationships.map(text=>"<li>"+escape(text)+"</li>").join("")+"</ol>",panel.append(figure),originalDiagram={original,kind}}function refreshDiagram(){let stage=panel?.querySelector(".create-diagram");originalDiagram&&stage?.clientWidth&&diagram(originalDiagram.original,stage,originalDiagram.kind)}function update(){if(disposed||step!==1)return;originalDiagram=void 0,panel&&(footer&&panel.contains(footer)&&root.append(footer),contextMount.append(panel),inlineMount.hidden=!0,inlineMount.replaceChildren(),buttons.clear(panel),panel.remove());let template=current(),guidance=guidanceFor(template),kind=kindFor(template);if(panel=document.createElement("section"),panel.className="create-starter-panel",panel.setAttribute("aria-label","Selected starter details"),step===1){panel.innerHTML='<h2 class="create-starter-heading">Starter architecture</h2>',renderInlineDiagram(template,kind);let caution=document.createElement("p");caution.className="create-caution",caution.textContent=guidance.introduction,panel.append(caution)}contextMount.append(panel),inlineMount=[...root.querySelectorAll("[data-create-inline]")].find(node=>node.dataset.createInline===template.id),sync()}let resizeFrame,observer=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame),resizeFrame=requestAnimationFrame(sync)});return step===1&&(observer.observe(root),update()),{update,dispose(){disposed||(disposed=!0,observer.disconnect(),cancelAnimationFrame(resizeFrame),footer&&panel?.contains(footer)&&root.append(footer),panel&&contextMount.append(panel))}}}import{basename as basename4}from"node:path";import{randomUUID as randomUUID3}from"node:crypto";import{dirname as dirname3,join as join7,resolve as resolve5}from"node:path";import{lstat as lstat4,mkdir as mkdir4,mkdtemp as mkdtemp2,readFile as readFile8,rename as rename4,rm as rm3,writeFile as writeFile6}from"node:fs/promises";import{setTimeout as delay}from"node:timers/promises";import{spawn}from"node:child_process";import{existsSync}from"node:fs";import{opendir,readFile as readFile3,realpath,stat}from"node:fs/promises";import{basename,dirname,extname,isAbsolute,join as join3,relative,resolve,sep,win32}from"node:path";import{fileURLToPath}from"node:url";var MAX_FILE_BYTES=512*1024,MAX_TOTAL_READ_BYTES=32*1024*1024,SELF_DIRECTORY=dirname(fileURLToPath(import.meta.url));import{APP_SERVICE_BUILDER_AI_GATEWAY_TEMPLATE as APP_SERVICE_BUILDER_AI_GATEWAY_TEMPLATE2,APP_SERVICE_BUILDER_TEMPLATE as APP_SERVICE_BUILDER_TEMPLATE2,EMPTY_TEMPLATE as EMPTY_TEMPLATE2,LOCAL_TEMPLATES,SANDBOX_GATEWAY_TEMPLATE as SANDBOX_GATEWAY_TEMPLATE2,listSourceCatalog,parseWorktrees,resolveSourcePlan}from"./source-catalog.mjs";import{execFile as execFile2}from"node:child_process";import{access,chmod as chmod2,cp,lstat as lstat3,mkdir as mkdir3,mkdtemp,readFile as readFile7,readdir,realpath as realpath3,rename as rename3,rm as rm2,writeFile as writeFile5}from"node:fs/promises";import{tmpdir}from"node:os";import{basename as basename3,join as join6,resolve as resolve4}from"node:path";import{fileURLToPath as fileURLToPath3}from"node:url";import{promisify}from"node:util";import{APP_SERVICE_BUILDER_AI_GATEWAY_TEMPLATE,APP_SERVICE_BUILDER_TEMPLATE,EMPTY_TEMPLATE,SANDBOXES_MINIMAL_TEMPLATE,SANDBOX_GATEWAY_TEMPLATE}from"./source-catalog.mjs";import{chmod,lstat as lstat2,readFile as readFile5,writeFile as writeFile4}from"node:fs/promises";import{join as join5,resolve as resolve3}from"node:path";import{fileURLToPath as fileURLToPath2}from"node:url";import{createHash}from"node:crypto";import{lstat,readFile as readFile4,realpath as realpath2,writeFile as writeFile3}from"node:fs/promises";import{basename as basename2,dirname as dirname2,isAbsolute as isAbsolute2,join as join4,relative as relative2,resolve as resolve2,win32 as win322}from"node:path";var MAX_BYTES=96*1024;var WEB_STYLE_PRESETS=Object.freeze(["copilot","warm","modern","editorial","minimal"]),LEGACY_STYLE_PRESET_MAP=Object.freeze({fluent:"copilot",azure:"modern",industrial:"minimal"});function normalizeWebStylePreset(rawPreset){let normalized=String(rawPreset??"").trim().toLowerCase();if(WEB_STYLE_PRESETS.includes(normalized))return normalized;if(LEGACY_STYLE_PRESET_MAP[normalized])return LEGACY_STYLE_PRESET_MAP[normalized]}var INLINE_WEB_STYLE_TOKENS_CSS=`
:root,[data-style="copilot"]{--bg:#faf9f8;--bg-elev:#ffffff;--surface-muted:#f3f2f0;--border:#e5e2dc;--text:#141418;--text-muted:#42434d;--text-soft:#686a78;--accent:#464feb;--accent-contrast:#ffffff;--radius-lg:16px;--radius-xl:20px;--shadow-2:0 2px 6px rgba(20,20,24,.05),0 8px 24px rgba(70,79,235,.06);--font-sans:"Segoe UI",-apple-system,BlinkMacSystemFont,sans-serif;--font-display:"Segoe UI",-apple-system,BlinkMacSystemFont,sans-serif}
[data-style="copilot"][data-theme="dark"]{--bg:#0f1015;--bg-elev:#171922;--surface-muted:#202330;--border:#2d3142;--text:#f5f6fa;--text-muted:#b9bccb;--text-soft:#8b90a3;--accent:#7b83ff;--accent-contrast:#0c0d14}
[data-style="warm"]{--bg:#f9f5f0;--bg-elev:#fffdfb;--surface-muted:#f1eae1;--border:#e4d9cc;--text:#231b15;--text-muted:#57483d;--text-soft:#7c6a5c;--accent:#c2410c;--accent-contrast:#ffffff;--radius-lg:14px;--radius-xl:18px;--shadow-2:0 2px 8px rgba(35,27,21,.06)}
[data-style="warm"][data-theme="dark"]{--bg:#16120f;--bg-elev:#211b17;--surface-muted:#2c241e;--border:#3e332b;--text:#f9f3ec;--text-muted:#cbbba9;--text-soft:#9a8978;--accent:#fb923c;--accent-contrast:#1b120b}
[data-style="modern"]{--bg:#f4f7fb;--bg-elev:#ffffff;--surface-muted:#eaeff7;--border:#d8e1ee;--text:#0f172a;--text-muted:#334155;--text-soft:#64748b;--accent:#0f6cbd;--accent-contrast:#ffffff;--radius-lg:10px;--radius-xl:12px;--shadow-2:0 2px 6px rgba(15,23,42,.06)}
[data-style="modern"][data-theme="dark"]{--bg:#0b1120;--bg-elev:#111827;--surface-muted:#1e293b;--border:#334155;--text:#f8fafc;--text-muted:#cbd5e1;--text-soft:#94a3b8;--accent:#38bdf8;--accent-contrast:#082f49}
[data-style="editorial"]{--bg:#f6f2ea;--bg-elev:#fdfbf7;--surface-muted:#efeae0;--border:#ded6c6;--text:#1c1917;--text-muted:#44403c;--text-soft:#78716c;--accent:#9a3412;--accent-contrast:#ffffff;--radius-lg:6px;--radius-xl:8px;--font-display:Georgia,Cambria,"Times New Roman",serif}
[data-style="editorial"][data-theme="dark"]{--bg:#141210;--bg-elev:#1c1917;--surface-muted:#292524;--border:#3f3a36;--text:#f5f2eb;--text-muted:#d6d0c4;--text-soft:#a8a096;--accent:#f59e0b;--accent-contrast:#1c1406}
[data-style="minimal"]{--bg:#f4f4f5;--bg-elev:#ffffff;--surface-muted:#e4e4e7;--border:#18181b;--text:#09090b;--text-muted:#27272a;--text-soft:#52525b;--accent:#09090b;--accent-contrast:#ffffff;--radius-lg:4px;--radius-xl:4px;--shadow-2:4px 4px 0 0 #18181b;--font-sans:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;--font-display:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
[data-style="minimal"][data-theme="dark"]{--bg:#09090b;--bg-elev:#121215;--surface-muted:#1f1f23;--border:#f4f4f5;--text:#fafafa;--text-muted:#d4d4d8;--text-soft:#a1a1aa;--accent:#fafafa;--accent-contrast:#09090b;--shadow-2:4px 4px 0 0 #f4f4f5}
html[data-style],body{background:var(--bg);color:var(--text);font-family:var(--font-sans)}
html[data-style] main{max-width:720px;margin:0 auto;background:var(--bg-elev);border:1px solid var(--border);border-radius:var(--radius-xl);box-shadow:var(--shadow-2);padding:32px}
html[data-style] h1,html[data-style] h2,html[data-style] h3{font-family:var(--font-display);color:var(--text)}
html[data-style] p{color:var(--text-muted)}
html[data-style] button,html[data-style] main a{display:inline-flex;align-items:center;justify-content:center;background:var(--accent);color:var(--accent-contrast);border:1px solid var(--accent);border-radius:var(--radius-lg);padding:10px 16px;font-weight:600;text-decoration:none;cursor:pointer}
html[data-style] textarea,html[data-style] input{background:var(--bg-elev);color:var(--text);border:1px solid var(--border);border-radius:var(--radius-lg)}
html[data-style] pre{background:var(--surface-muted);color:var(--text);border:1px solid var(--border);border-radius:var(--radius-lg)}
`.trim();function applyWebStylePreset(content,stylePreset,colorTheme){let resolvedPreset=normalizeWebStylePreset(stylePreset)??"copilot",resolvedTheme=colorTheme==="dark"?"dark":colorTheme==="light"?"light":void 0,updated=content;return/<header\s+class=["']toolbar["'][\s\S]*?<\/header>\s*/i.test(updated)&&(updated=updated.replace(/<header\s+class=["']toolbar["'][\s\S]*?<\/header>\s*/gi,"")),/<html\b[^>]*\bdata-style=["'][a-z0-9_-]+["']/i.test(updated)?updated=updated.replace(/(<html\b[^>]*\bdata-style=["'])([a-z0-9_-]+)(["'])/i,`$1${resolvedPreset}$3`):/<html\b/i.test(updated)&&(updated=updated.replace(/<html\b/i,`<html data-style="${resolvedPreset}" data-theme="${resolvedTheme??"light"}"`)),resolvedTheme&&(/<html\b[^>]*\bdata-theme=["'][a-z0-9_-]+["']/i.test(updated)?updated=updated.replace(/(<html\b[^>]*\bdata-theme=["'])([a-z0-9_-]+)(["'])/i,`$1${resolvedTheme}$3`):/<html\b[^>]*\bdata-style=["'][a-z0-9_-]+["']/i.test(updated)&&(updated=updated.replace(/(<html\b[^>]*\bdata-style=["'][a-z0-9_-]+["'])/i,`$1 data-theme="${resolvedTheme}"`))),/<style>[\s\S]*?<\/style>/i.test(updated)&&!/\[data-style=["']copilot["']\]\[data-theme=["']dark["']\]|\[data-theme=["']dark["']\]/i.test(updated)?(updated=updated.replace(/:root,\[data-style=["']copilot["']\][\s\S]*?html\[data-style\]\s+pre\{[^\n}]*\}\n?/i,""),updated=updated.replace(/<\/style>/i,`
${INLINE_WEB_STYLE_TOKENS_CSS}
</style>`)):/<\/head>/i.test(updated)&&!/tokens\.css|\[data-style=["']copilot["']\]/i.test(updated)&&(updated=updated.replace(/<\/head>/i,`<style>
${INLINE_WEB_STYLE_TOKENS_CSS}
</style>
</head>`)),/<body>\s*<h1>/i.test(updated)&&!/<main\b/i.test(updated)&&(updated=updated.replace(/<body>\s*(<h1>)/i,`<body><main>
$1`).replace(/(<\/pre>)\s*(<script>)/i,`$1
</main>$2`)),/useState<StylePreset>\(\s*["'][a-z0-9_-]+["']\s*\)/.test(updated)?updated=updated.replace(/(useState<StylePreset>\(\s*["'])([a-z0-9_-]+)(["']\s*\))/,`$1${resolvedPreset}$3`):!/<html\b/i.test(updated)&&/\bdata-style=["'][a-z0-9_-]+["']/i.test(updated)?updated=updated.replace(/(\bdata-style=["'])([a-z0-9_-]+)(["'])/i,`$1${resolvedPreset}$3`):!/<html\b/i.test(updated)&&/<(main|div)\s+className=/.test(updated)&&(updated=updated.replace(/<(main|div)\s+className=/,`<$1 data-style="${resolvedPreset}" data-theme="${resolvedTheme??"light"}" className=`)),resolvedTheme&&!/<html\b/i.test(updated)&&(/\bdata-theme=["'][a-z0-9_-]+["']/i.test(updated)?updated=updated.replace(/(\bdata-theme=["'])([a-z0-9_-]+)(["'])/i,`$1${resolvedTheme}$3`):/\bdata-style=["'][a-z0-9_-]+["']/i.test(updated)&&(updated=updated.replace(/(\bdata-style=["'][a-z0-9_-]+["'])/i,`$1 data-theme="${resolvedTheme}"`))),/<button\b[^>]*\bdata-style-choice=["'][a-z0-9_-]+["'][^>]*>/i.test(updated)&&(updated=updated.replace(/<button\b([^>]*\bdata-style-choice=["']([a-z0-9_-]+)["'][^>]*)>/gi,(_match,attrs,choice)=>`<button${attrs.replace(/\s+data-selected=["'][^"']*["']/gi,"")}${(normalizeWebStylePreset(choice)??choice.toLowerCase())===resolvedPreset?' data-selected="true"':""}>`)),updated}var TAILWIND_WEB_STYLE_TOKENS_CSS=`
${INLINE_WEB_STYLE_TOKENS_CSS}
body:has([data-style]),main[data-style]{background:var(--bg);color:var(--text);font-family:var(--font-sans)}
[data-style] .bg-white{background-color:var(--bg-elev)!important}
[data-style] .bg-slate-50,[data-style] .bg-slate-100{background-color:var(--surface-muted)!important}
[data-style] .bg-slate-900,[data-style] .bg-emerald-600{background-color:var(--accent)!important;color:var(--accent-contrast)!important}
[data-style] .border-slate-100,[data-style] .border-slate-200,[data-style] .border-slate-300{border-color:var(--border)!important}
[data-style] .text-slate-900,[data-style] .text-slate-800{color:var(--text)!important}
[data-style] .text-slate-700,[data-style] .text-slate-600{color:var(--text-muted)!important}
[data-style] .text-slate-500{color:var(--text-soft)!important}
[data-style] .rounded-2xl{border-radius:var(--radius-xl)!important}
[data-style] .rounded-xl{border-radius:var(--radius-lg)!important}
[data-style] .shadow-sm{box-shadow:var(--shadow-2)!important}
`.trim();var ASSET_ROOT=fileURLToPath2(new URL("./templates/shared/dealer",import.meta.url)),SCRIPT_FILES=["scripts/dev-start.sh","scripts/dev-stop.sh","scripts/dev-start.ps1","scripts/dev-stop.ps1"],REQUIRED_DEALER_PATHS=[...SCRIPT_FILES,"scripts/load-ports.sh","scripts/load-ports.ps1","src/agent/main.py","src/web/package.json","src/skills/inventory-search/local.settings.json.example","src/skills/trade-in-value/local.settings.json.example","src/skills/rate-sheet/local.settings.json.example","src/skills/deal-doc/local.settings.json.example"],RUNTIME_IGNORE_RULES=[".azure-app-platform/",".dev-run/"],PORT_IMPORT="from local_ports import agent_listen_port, agent_port_override, local_skill_ports";function adaptAgentSource(source){if(source.includes(PORT_IMPORT)&&/LOCAL_SKILL_PORTS(?:\s*:\s*dict\[str,\s*int\])?\s*=\s*local_skill_ports\(\)/.test(source)&&/ResponsesHostServer\((?:agent|build_agent\(\))\)\.run\(port=agent_port_override\(\)\)/.test(source))return source;if(source.includes("from local_ports import"))throw new Error("Unsupported Dealer agent layout: an unknown local_ports integration is already present.");let importAnchor="from azure.identity import DefaultAzureCredential";if(!source.includes(importAnchor))throw new Error("Unsupported Dealer agent layout: Azure identity import anchor was not found.");let skillPorts=/LOCAL_SKILL_PORTS\s*:\s*dict\[str,\s*int\]\s*=\s*\{\s*["']inventory-search["']\s*:\s*7071,\s*["']trade-in-value["']\s*:\s*7072,\s*["']rate-sheet["']\s*:\s*7073,\s*["']deal-doc["']\s*:\s*7074,?\s*\}/m;if(!skillPorts.test(source))throw new Error("Unsupported Dealer agent layout: the known four-skill port map was not found.");let hostRun=/ResponsesHostServer\((agent|build_agent\(\))\)\.run\(\)/;if(!hostRun.test(source))throw new Error("Unsupported Dealer agent layout: the ResponsesHostServer launch call was not found.");let adapted=source.replace(importAnchor,`${importAnchor}
${PORT_IMPORT}`);return adapted=adapted.replace(skillPorts,"LOCAL_SKILL_PORTS = local_skill_ports()"),adapted=adapted.replace(hostRun,(_match,agentExpression)=>`ResponsesHostServer(${agentExpression}).run(port=agent_port_override())`),adapted=adapted.replace(/logger\.info\("Agent built\. Starting Responses host server on http:\/\/127\.0\.0\.1:8088 \.\.\."\)/,["logger.info(",'        "Agent built. Starting Responses host server on http://127.0.0.1:%d ...",',"        agent_listen_port(),","    )"].join(`
`)),adapted}async function assertSupportedDealer(destination){for(let path of REQUIRED_DEALER_PATHS){let entry;try{entry=await lstat2(join5(destination,path))}catch(error){throw error?.code==="ENOENT"?new Error(`Unsupported Dealer sample layout: required path is missing: ${path}`):error}if(!entry.isFile())throw new Error(`Unsupported Dealer sample layout: required path is not a regular file: ${path}`)}}async function readOptionalFile(path){try{return await readFile5(path,"utf8")}catch(error){if(error?.code==="ENOENT")return"";throw error}}function appendMissingRuntimeIgnores(source){let normalizedRules=new Set(source.split(/\r?\n/).flatMap(line=>{let trimmed=line.trim();return!trimmed||trimmed.startsWith("#")||trimmed.startsWith("!")?[]:[trimmed.replace(/^\/|^\*\*\//,"").replace(/\/+$/,"")]})),missing=RUNTIME_IGNORE_RULES.filter(rule=>!normalizedRules.has(rule.replace(/\/$/,"")));if(missing.length===0)return source;let newline=source.includes(`\r
`)?`\r
`:`
`,separator=source.length>0&&!source.endsWith(`
`)?newline:"";return`${source}${separator}${missing.join(newline)}${newline}`}async function prepareDealerPortOverrides(destination){let root=resolve3(destination);await assertSupportedDealer(root);let agentPath=join5(root,"src","agent","main.py"),gitignorePath=join5(root,".gitignore"),[agentSource,gitignoreSource,localPortsSource,...scriptSources]=await Promise.all([readFile5(agentPath,"utf8"),readOptionalFile(gitignorePath),readFile5(join5(ASSET_ROOT,"src","agent","local_ports.py"),"utf8"),...SCRIPT_FILES.map(path=>readFile5(join5(ASSET_ROOT,path),"utf8"))]),adaptedAgent=adaptAgentSource(agentSource),adaptedGitignore=appendMissingRuntimeIgnores(gitignoreSource),writes=[writeFile4(agentPath,adaptedAgent),writeFile4(join5(root,"src","agent","local_ports.py"),localPortsSource),...SCRIPT_FILES.map((path,index)=>writeFile4(join5(root,path),scriptSources[index]))];adaptedGitignore!==gitignoreSource&&writes.push(writeFile4(gitignorePath,adaptedGitignore)),await Promise.all(writes),await Promise.all([chmod(join5(root,"scripts","dev-start.sh"),493),chmod(join5(root,"scripts","dev-stop.sh"),493)]);let webPagePath=join5(root,"src","web","src","app","page.tsx"),webPageSource=await readOptionalFile(webPagePath);if(webPageSource){let styledWebPage=applyWebStylePreset(webPageSource,"copilot","light");styledWebPage!==webPageSource&&await writeFile4(webPagePath,styledWebPage,"utf8")}let globalsCssPath=join5(root,"src","web","src","app","globals.css"),globalsCssSource=await readOptionalFile(globalsCssPath);return globalsCssSource&&!/\[data-style=["']copilot["']\]\[data-theme=["']dark["']\]/i.test(globalsCssSource)&&await writeFile4(globalsCssPath,`${globalsCssSource.trimEnd()}

${TAILWIND_WEB_STYLE_TOKENS_CSS}
`,"utf8"),{kind:"dealer-port-overrides",destination:root,adaptedAgent:adaptedAgent!==agentSource,copiedFiles:[...SCRIPT_FILES,"src/agent/local_ports.py"]}}import{relative as relative3}from"node:path";import{readFile as readFile6}from"node:fs/promises";var BUILD_BLOCK_TEMPLATES=Object.freeze([{id:"hosted-skill",name:"Hosted skill",tierId:"skills",projectPath:"src/skills/{name}",description:"An HTTP-triggered Azure Function starter. Define its bounded operation before connecting it to your agent.",entry:"function_app.py",source:"empty-starter-app/src/skills/__SKILL__",authoringSkill:"azure-app-platform-hosted-skill"},{id:"agent-instructions",name:"Agent",tierId:"agent",projectPath:"src/agents/{name}",description:"Instructions, agent manifest, and an explicit runtime configuration seam. Choose and connect a runtime separately.",entry:"prompts/system.md",source:"build-blocks/agent-instructions",authoringSkill:"azure-app-platform-agent-instructions"},{id:"user-experience",name:"User Experience - Web / App Service Builder",tierId:"web",projectPath:"src/web/{name}",description:"A static web page with App Service Builder configuration. Connect application endpoints separately.",entry:"index.html",source:"build-blocks/web",authoringSkill:"azure-app-platform-block-authoring"},...Object.entries({http:"HTTP",timer:"Timer",event:"Event Grid",queue:"Storage queue"}).map(([kind,label])=>({id:`${kind}-trigger`,name:`Trigger - ${label}`,tierId:"skills",projectPath:"src/triggers/{name}",description:`Azure Functions ${label} trigger. Implement its handler and configure authentication, storage, and event sources separately.`,entry:"function_app.py",source:`build-blocks/${kind}-trigger`,baseSource:"build-blocks/functions-base",authoringSkill:"azure-app-platform-block-authoring"})),{id:"connector",name:"Connector - External API / SaaS / Graph",tierId:"connectors",projectPath:"src/connectors/{name}",description:"A connector contract and configuration starter, not a live connection. Define endpoints, authentication, and bounded operations.",entry:"connector.json",source:"build-blocks/connector",authoringSkill:"azure-app-platform-block-authoring"},{id:"orchestration",name:"Orchestration - Durable workflow",tierId:"workflows",projectPath:"src/workflows/{name}",description:"An HTTP-started Durable Functions workflow with an intentionally unimplemented activity. Configure storage and implement the operation.",entry:"function_app.py",source:"build-blocks/orchestration",authoringSkill:"azure-app-platform-block-authoring"},{id:"sandbox",name:"Sandbox - Isolated tool execution",tierId:"sandbox",projectPath:"src/sandboxes/{name}",description:"A bounded tool contract, Python entry point, container, and ACA egress policy. Implement the operation and connect an ACA Sandbox separately.",entry:"main.py",source:"build-blocks/sandbox",authoringSkill:"azure-app-platform-block-authoring"},{id:"operations",name:"Operations - Observability / SRE Agent",tierId:"sre",projectPath:"src/operations/{name}",description:"An operations runbook and SRE configuration starter. No monitoring, permissions, remediation, or Azure agent is created.",entry:"sre-agent.yaml",source:"build-blocks/operations",authoringSkill:"azure-app-platform-block-authoring"}].map(Object.freeze));var execFileAsync=promisify(execFile2),EMPTY_TEMPLATE_ID="builtin-empty-starter-v1",SANDBOXES_MINIMAL_TEMPLATE_ID="builtin-sandboxes-minimal-v1",SANDBOX_GATEWAY_TEMPLATE_ID="builtin-sandbox-gateway-minimal-v1",APP_SERVICE_BUILDER_AI_GATEWAY_TEMPLATE_ID="builtin-app-service-builder-ai-gateway-v1",APP_SERVICE_BUILDER_TEMPLATE_ID="builtin-app-service-builder-vite-v1",TEMPLATE_ROOTS={[EMPTY_TEMPLATE_ID]:fileURLToPath3(new URL("./templates/empty-starter-app",import.meta.url)),[SANDBOXES_MINIMAL_TEMPLATE_ID]:fileURLToPath3(new URL("./templates/sandbox-gateway-minimal",import.meta.url)),[SANDBOX_GATEWAY_TEMPLATE_ID]:fileURLToPath3(new URL("./templates/sandbox-gateway-minimal",import.meta.url)),[APP_SERVICE_BUILDER_AI_GATEWAY_TEMPLATE_ID]:fileURLToPath3(new URL("./templates/app-service-builder-ai-gateway",import.meta.url)),[APP_SERVICE_BUILDER_TEMPLATE_ID]:fileURLToPath3(new URL("./templates/app-service-builder-vite",import.meta.url))},APP_NAME_PATTERN=/^[A-Za-z0-9][A-Za-z0-9 ._-]{0,79}$/,SKILL_NAME_PATTERN=/^[a-z][a-z0-9-]{0,39}$/,DOMAIN_PATTERN=/^(?=.{1,253}$)[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;function requireText(value,label,pattern,maxLength){if(typeof value!="string"||!value.trim()||value.length>maxLength||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)||pattern&&!pattern.test(value))throw new Error(`Invalid ${label}.`);return value.trim()}function escapeHtml(value){return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}async function replaceTokens(root,tokens){let stack=[root];for(;stack.length>0;){let directory=stack.pop(),entries=await readdir(directory,{withFileTypes:!0});for(let entry of entries){let path=join6(directory,entry.name);if(entry.isDirectory()){stack.push(path);continue}if(entry.isSymbolicLink())throw new Error(`Template symlinks are not allowed: ${path}`);let content=await readFile7(path,"utf8");for(let[token,value]of Object.entries(tokens))content=content.replaceAll(token,value);/\.md(?:\.template)?$/.test(path)&&(content=content.replace(/(\]\((?![a-z]+:)[^)\s]+)\.template(?=[)#])/gi,"$1"));let output=path.endsWith(".template")?path.slice(0,-9):path;await writeFile5(output,content),output!==path&&await rm2(path)}}}async function materializeLocalTemplate(plan,destination){let templateId=plan.sourcePlan?.templateId??EMPTY_TEMPLATE_ID,isSandboxesMinimal=templateId===SANDBOXES_MINIMAL_TEMPLATE_ID,isSandboxGateway=templateId===SANDBOX_GATEWAY_TEMPLATE_ID,isSandboxTemplate=isSandboxGateway||isSandboxesMinimal,isAppServiceBuilderAiGateway=templateId===APP_SERVICE_BUILDER_AI_GATEWAY_TEMPLATE_ID,isAppServiceBuilder=templateId===APP_SERVICE_BUILDER_TEMPLATE_ID,templateRoot=TEMPLATE_ROOTS[templateId]??TEMPLATE_ROOTS[EMPTY_TEMPLATE_ID],appName=requireText(plan.appName,"app name",APP_NAME_PATTERN,80),purpose=requireText(plan.purpose,"app purpose",null,500),agentInstructions=requireText(plan.templateInputs?.agentInstructions??`Help users accomplish: ${purpose}`,"agent instructions",null,2e3),staging=await mkdtemp(join6(tmpdir(),"app-platform-empty-")),requiredFiles;try{let templateEntries=await readdir(templateRoot);await Promise.all(templateEntries.map(entry=>cp(join6(templateRoot,entry),join6(staging,entry),{recursive:!0,force:!0,filter:source=>!["__pycache__",".venv",".pytest_cache","node_modules",".git"].includes(basename3(source))}))),await materializePortLoaders(staging);let tokens={__APP_NAME__:appName,__APP_NAME_HTML_JSON__:JSON.stringify(escapeHtml(appName)),__APP_SLUG__:appName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),__PURPOSE_JSON__:JSON.stringify(purpose).slice(1,-1),__PURPOSE__:purpose,__PURPOSE_HTML__:escapeHtml(purpose),__USER_INTENT__:purpose,__PURPOSE_HTML_JSON__:JSON.stringify(escapeHtml(purpose)),__AGENT_INSTRUCTIONS__:agentInstructions};if(isSandboxTemplate){let egressAllowDomain=requireText(plan.templateInputs?.egressAllowDomain??"api.lender.example.com","egress allow-list domain",DOMAIN_PATTERN,253);tokens.__EGRESS_ALLOW_DOMAIN__=egressAllowDomain}else if(!isAppServiceBuilder&&!isAppServiceBuilderAiGateway){let hostedSkillName=requireText(plan.templateInputs?.hostedSkillName??"starter-skill","Hosted Skill name",SKILL_NAME_PATTERN,40);await rename3(join6(staging,"src","skills","__SKILL__"),join6(staging,"src","skills",hostedSkillName)),tokens.__SKILL_NAME__=hostedSkillName,requiredFiles=EMPTY_TEMPLATE.requiredPaths.map(path=>path.replaceAll("<hosted-skill>",hostedSkillName))}await replaceTokens(staging,tokens),isSandboxesMinimal?(await rm2(join6(staging,"infra-ai-gateway"),{recursive:!0,force:!0}),await writeFile5(join6(staging,"azure-app.yaml"),[`name: ${tokens.__APP_SLUG__}`,`purpose: "${tokens.__PURPOSE_JSON__}"`,"capabilities:","  agent:","    path: src/agent","    # Default only; scripts and Studio apply .azure-app-platform/ports.env when saved.","    interface: http://localhost:8088","    links: [sandbox]","  sandbox:","    path: src/tools/document-validation","    # Default local simulation; config/runtime.json selects optional ACA sessions with Sandboxes egress proxy.","    interface: subprocess","    links: [agent]",""].join(`
`),"utf8"),requiredFiles=[...SANDBOXES_MINIMAL_TEMPLATE.requiredPaths]):isSandboxGateway?requiredFiles=[...SANDBOX_GATEWAY_TEMPLATE.requiredPaths]:isAppServiceBuilderAiGateway?requiredFiles=[...APP_SERVICE_BUILDER_AI_GATEWAY_TEMPLATE.requiredPaths]:isAppServiceBuilder&&(requiredFiles=[...APP_SERVICE_BUILDER_TEMPLATE.requiredPaths]),await Promise.all(requiredFiles.map(path=>access(join6(staging,path))));let renderedEntries=await readdir(staging);await Promise.all(renderedEntries.map(entry=>cp(join6(staging,entry),join6(destination,entry),{recursive:!0,force:!0})))}finally{await rm2(staging,{recursive:!0,force:!0})}return await Promise.all([chmod2(join6(destination,"scripts","dev-start.sh"),493),chmod2(join6(destination,"scripts","dev-stop.sh"),493)]),{kind:"empty-template",destination,requiredFiles}}async function materializeSample(plan,destination,commandRunner){let source=resolve4(requireText(plan.sourcePlan?.rootPath,"sample source path",null,2048)),commit=requireText(plan.sourcePlan?.commit,"sample commit",/^[0-9a-f]{40}$/,40),temporaryRoot=await mkdtemp(join6(tmpdir(),"app-platform-sample-")),archive=join6(temporaryRoot,"sample.tar"),extracted=join6(temporaryRoot,"source");try{await mkdir3(extracted);let archived=await commandRunner("git",["-C",source,"archive","--format=tar",`--output=${archive}`,commit]);if(!archived?.ok)throw new Error(`Could not archive the pinned Dealer sample: ${archived?.stderr||archived?.error||"unknown error"}`);let unpacked=await commandRunner("tar",["-xf",archive,"-C",extracted]);if(!unpacked?.ok)throw new Error(`Could not unpack the pinned Dealer sample: ${unpacked?.stderr||unpacked?.error||"unknown error"}`);let requiredFiles=["scripts/dev-start.sh","scripts/dev-stop.sh","scripts/dev-start.ps1","scripts/dev-stop.ps1"];await Promise.all(requiredFiles.map(path=>access(join6(extracted,path))));let existingEntries=await readdir(destination);await Promise.all(existingEntries.filter(entry=>entry!==".git").map(entry=>rm2(join6(destination,entry),{recursive:!0,force:!0})));let sampleEntries=await readdir(extracted);await Promise.all(sampleEntries.map(entry=>cp(join6(extracted,entry),join6(destination,entry),{recursive:!0,force:!0}))),await materializePortLoaders(destination),await prepareDealerPortOverrides(destination)}finally{await rm2(temporaryRoot,{recursive:!0,force:!0})}return await Promise.all([chmod2(join6(destination,"scripts","dev-start.sh"),493),chmod2(join6(destination,"scripts","dev-stop.sh"),493)]),{kind:"complete-sample",destination,commit,requiredFiles:["scripts/dev-start.sh","scripts/dev-stop.sh","scripts/dev-start.ps1","scripts/dev-stop.ps1"]}}async function defaultCommandRunner(command,args){try{return{ok:!0,...await execFileAsync(command,args,{maxBuffer:10485760})}}catch(error){return{ok:!1,stdout:error.stdout||"",stderr:error.stderr||"",error:error.message}}}async function materializePortLoaders(destination){await Promise.all(["load-ports.sh","load-ports.ps1"].map(file=>cp(fileURLToPath3(new URL(`./templates/shared/${file}`,import.meta.url)),join6(destination,"scripts",file))))}async function materializeTemplate(plan,{destination=process.cwd(),commandRunner=defaultCommandRunner}={}){let resolvedDestination=resolve4(destination);if(plan?.sourcePlan?.kind==="empty-template")return materializeLocalTemplate(plan,resolvedDestination);if(plan?.sourcePlan?.kind==="complete-sample")return materializeSample(plan,resolvedDestination,commandRunner);throw new Error("Unsupported app template plan.")}async function main(){let encoded=process.argv[2];if(!encoded)throw new Error("Usage: node template-materializer.mjs <base64url-plan>");let plan=JSON.parse(Buffer.from(encoded,"base64url").toString("utf8")),result=await materializeTemplate(plan);process.stdout.write(`${JSON.stringify(result,null,2)}
`)}process.argv[1]&&basename3(process.argv[1])===basename3(fileURLToPath3(import.meta.url))&&main().catch(error=>{process.stderr.write(`${error.message}
`),process.exitCode=1});import{pickAvailablePorts,reservedPortsForApps}from"./local-ports.mjs";import{stat as stat2}from"node:fs/promises";import{isAbsolute as isAbsolute3,win32 as win323}from"node:path";var APP_NAME_PATTERN2=/^[A-Za-z0-9][A-Za-z0-9 ._-]{0,79}$/;var APP_SERVICE_BUILDER_CUSTOMIZATION_SKILLS=Object.freeze([{name:"azure-app-platform-fluent-theme",path:"skills/azure-app-platform-fluent-theme/SKILL.md"},{name:"azure-app-platform-spot-illustration",path:"skills/azure-app-platform-spot-illustration/SKILL.md"}]);var WORKSPACE_TIER_IDS=Object.freeze(PLATFORM_TIERS.map(tier=>tier.id));function showAppDeleteDialog({root,name,request,buttons,onPending=()=>{},returnFocus=document.activeElement}){return new Promise(resolve6=>{let dialog=document.createElement("dialog");dialog.className="app-delete-dialog",dialog.setAttribute("role","alertdialog"),dialog.setAttribute("aria-modal","true"),dialog.setAttribute("aria-labelledby","app-delete-title"),dialog.setAttribute("aria-describedby","app-delete-path app-delete-warning app-delete-cloud"),dialog.tabIndex=-1,buttons.replace(dialog,'<form><h2 id="app-delete-title"></h2><p id="app-delete-path"></p><p id="app-delete-warning">This permanently removes the local Git worktree, all its files, and its Canvas-created branch. Uncommitted changes and untracked files will be permanently lost (git worktree remove --force). This cannot be undone.</p><p id="app-delete-cloud">No Azure resources, repositories, or cloud deployments will be deleted.</p><p role="status" data-delete-status></p><div class="app-delete-actions"><button type="button" tabindex="0" data-studio-button="secondary" id="cancel-delete">No, keep app</button><button type="submit" tabindex="0" class="danger" id="confirm-delete">Yes, delete worktree</button></div></form>'),dialog.querySelector("h2").textContent="Delete "+name+"?",dialog.querySelector("#app-delete-path").textContent=root;let style=document.createElement("style");style.textContent=`
      .app-delete-dialog { box-sizing:border-box; position:fixed; inset:0; margin:auto; width:min(440px, calc(100vw - 32px)); max-height:calc(100dvh - 32px); overflow:auto; padding:20px; border:1px solid var(--studio-line); border-radius:var(--studio-dialog-radius, 8px); background:var(--studio-raised); color:var(--studio-ink); font:13px/1.5 var(--font-sans, system-ui, sans-serif); }
      .app-delete-dialog::backdrop { background:rgb(0 0 0 / .4); }
      .app-delete-dialog h2 { margin:0 0 12px; font-size:18px; overflow-wrap:anywhere; }
      .app-delete-dialog p { color:var(--studio-muted); overflow-wrap:anywhere; }
      .app-delete-dialog #app-delete-path { color:var(--studio-ink); font-family:var(--font-mono, monospace); }
      .app-delete-dialog .app-delete-actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; margin-top:16px; }
      .app-delete-dialog .danger { padding:6px 10px; border:1px solid var(--studio-danger); border-radius:6px; background:var(--studio-raised); color:var(--studio-danger); font:inherit; cursor:pointer; }
      .app-delete-dialog .danger:disabled { opacity:.6; cursor:not-allowed; }
      .app-delete-dialog .danger:focus-visible { outline:2px solid var(--studio-focus); outline-offset:2px; }
      .app-delete-dialog [data-delete-status]:empty { display:none; }
    `,dialog.append(style),document.body.append(dialog);let cancel=dialog.querySelector("#cancel-delete"),confirm=dialog.querySelector("#confirm-delete"),pending=!1,result=null;cancel.addEventListener("click",()=>{pending||dialog.close()}),dialog.addEventListener("cancel",event=>{event.preventDefault(),pending||dialog.close()}),dialog.addEventListener("keydown",event=>{if(event.key==="Escape"&&(event.preventDefault(),event.stopPropagation(),pending||dialog.close()),event.key!=="Tab"||event.altKey||event.ctrlKey||event.metaKey)return;event.preventDefault();let targets=[cancel,confirm].filter(target=>!target.disabled);if(!targets.length){dialog.focus();return}let index=targets.indexOf(document.activeElement),next=index<0?event.shiftKey?targets.length-1:0:(index+(event.shiftKey?-1:1)+targets.length)%targets.length;targets[next].focus()}),dialog.addEventListener("close",()=>{buttons.clear(dialog),dialog.remove(),returnFocus?.isConnected&&!returnFocus.disabled&&returnFocus.focus({preventScroll:!0}),resolve6(result)},{once:!0}),dialog.querySelector("form").addEventListener("submit",async event=>{if(event.preventDefault(),!pending){pending=!0,dialog.setAttribute("aria-busy","true"),buttons.setDisabled(cancel,!0),buttons.setDisabled(confirm,!0),dialog.querySelector("[data-delete-status]").textContent="Deleting local worktree. This operation cannot be cancelled.",dialog.focus();try{if(onPending(),result=await request("/api/delete-app",{method:"POST",body:JSON.stringify({root,confirmed:!0})}),!["complete","partial","failed"].includes(result?.outcome)||result.worktreeRemoved!==(result.outcome!=="failed")||result.worktreeRemoved&&typeof result.message!="string"||result.outcome==="failed"&&typeof result.error!="string")throw new Error("Canvas returned an invalid deletion result. Refresh the app list before taking further action.")}catch(cause){result={outcome:"failed",worktreeRemoved:!1,error:cause.message}}dialog.close()}}),dialog.showModal(),cancel.focus()})}import{renderInteractiveAppMapHtml}from"./interactive-app-map.mjs";var OPEN_APP_EMPTY_ILLUSTRATIONS=Object.fromEntries(["light","dark"].map(theme=>[theme,readFileSync(new URL(`./assets/open-app-empty-${theme}.svg`,import.meta.url),"utf8").replace('role="img"','aria-hidden="true" focusable="false"').replace(/ aria-labelledby="[^"]*"/,"")])),homepageArtwork=Object.fromEntries(["create","open","assemble"].map(name=>[name,Object.fromEntries(["light","dark"].map(theme=>[theme,readFileSync(new URL("./assets/homepage-"+name+(theme==="dark"?"-dark":"")+".svg",import.meta.url),"utf8")]))]));function escapeHtml2(value){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function renderAppMapMarkup(appMap,{expanded=!1}={}){let nodesById=new Map(appMap.nodes.map(node=>[node.id,node])),outgoing=new Map;for(let edge of appMap.edges)outgoing.has(edge.from)||outgoing.set(edge.from,[]),outgoing.get(edge.from).push(edge);let unresolved=new Map;for(let item of appMap.unresolved||[])unresolved.has(item.from)||unresolved.set(item.from,[]),unresolved.get(item.from).push(item);let lanes=PLATFORM_TIERS.map(tier=>{let nodes=appMap.nodes.filter(node=>node.tierId===tier.id);return nodes.length===0?"":'<section class="map-lane" data-map-tier="'+escapeHtml2(tier.id)+'"><div class="map-lane-head"><strong>'+escapeHtml2(tier.mapLabel||tier.name)+"</strong><small>"+nodes.length+(nodes.length===1?" node":" nodes")+"</small></div>"+nodes.map(node=>{let links=(outgoing.get(node.id)||[]).map(edge=>{let target=nodesById.get(edge.to);return'<div class="map-link"><span class="arrow">'+renderOcticon("arrow-right")+"</span><span>"+escapeHtml2(edge.kind.replaceAll("-"," "))+" <b>"+escapeHtml2(target?.name||edge.to)+"</b></span></div>"}),missing=(unresolved.get(node.id)||[]).map(item=>'<div class="map-link unresolved"><span class="arrow">'+renderOcticon("question")+"</span><span>Unresolved <b>"+escapeHtml2(item.reference)+"</b></span></div>"),evidence=node.evidence?.[0],details=(node.details||[]).map(detail=>'<div class="map-detail"><span>'+escapeHtml2(detail.label)+"</span><b>"+escapeHtml2(detail.value)+"</b></div>").join(""),badges=(node.badges||[]).map(badge=>{let item=typeof badge=="string"?{label:badge,kind:"default"}:badge;return'<span class="map-badge '+escapeHtml2(item.kind||"default")+'">'+escapeHtml2(item.label)+"</span>"}).join("");return'<article class="map-node '+escapeHtml2(node.kind||"project")+'"><strong>'+escapeHtml2(node.name)+"</strong>"+(node.projectPath&&node.projectPath!=="."?"<code>"+escapeHtml2(node.projectPath)+"</code>":"")+(badges?'<div class="map-badges">'+badges+"</div>":"")+(details?'<div class="map-details">'+details+"</div>":"")+(links.length||missing.length?'<div class="map-links">'+links.join("")+missing.join("")+"</div>":"")+(evidence?'<div class="map-evidence">'+escapeHtml2(evidence.path+":"+evidence.line)+"</div>":"")+"</article>"}).join("")+"</section>"}).filter(Boolean),empty=lanes.length===0?'<div class="map-empty">No source-derived components were found.</div>':'<div class="map-lanes">'+lanes.join("")+"</div>";return'<div class="app-map-visual'+(expanded?" expanded":"")+'" role="region" aria-label="Application graph">'+empty+'</div><div class="map-footer"><span class="map-legend">Solid cards are projects \xB7 dashed cards are operations \xB7 arrows are source-derived calls</span><span class="badge">'+appMap.edges.length+" edges \xB7 "+(appMap.unresolved||[]).length+" unresolved</span></div>"}function renderStudioHtml(instanceId,apiToken="",{theme="light",intro=!1,editorSettings=DEFAULT_EDITOR_SETTINGS,presentationProfile="standalone"}={}){let presentation=getStudioPresentation(presentationProfile),capabilities=PLATFORM_TIERS.map(tier=>({id:tier.id,name:tier.name,role:tier.role}));return`<!doctype html>
<html lang="en" class="${presentation.className}" data-studio-theme="${escapeHtml2(theme)}" data-studio-presentation="${presentation.id}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="data:,">
    <title>Azure App Platform</title>
    <link rel="stylesheet" href="/canvas-ui/styles.css">
    <link rel="stylesheet" href="/canvas-ui/base.css">
    ${presentation.stylesheet?`<link rel="stylesheet" href="${presentation.stylesheet}">`:""}
    <style>
      ${STUDIO_BUTTON_MOUNT_CSS}
      ${renderPresentationStyles(presentation.id)}
      ${JOURNEY_LOADING_STYLES}
      @layer studio-legacy {
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        padding: 8px 24px 48px;
        background:
          radial-gradient(1200px 600px at 100% -12%, color-mix(in srgb, var(--studio-accent) 6%, transparent), transparent),
          var(--studio-bg);
        color: var(--studio-ink);
        font: var(--text-body-medium, 14px)/var(--leading-body-medium, 1.5) var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
      }
      main { width: min(100%, 888px); margin: 0 auto; padding: 24px 0; }
      h1 { margin: 0 0 8px; font-size: var(--text-title-size, 20px); line-height: var(--text-title-line-height, 28px); font-weight: var(--font-weight-semibold, 600); letter-spacing: normal; }
      h2 { margin: 20px 0 6px; font-size: var(--text-subtitle-size, 15px); line-height: 22px; font-weight: var(--font-weight-semibold, 600); }
      h3 { font-size: var(--canvas-body, 13px); line-height: 18px; font-weight: var(--font-weight-semibold, 600); }
      p { margin: 6px 0 16px; color: var(--canvas-muted, var(--studio-muted)); font-size: var(--canvas-body, 13px); line-height: 20px; font-weight: 400; }
      code { overflow-wrap: anywhere; font: var(--text-code-inline, 12px) var(--font-mono, "SFMono-Regular", Consolas, monospace); }
      button, input, textarea, select { font: inherit; }
      button {
        min-height: 40px;
        border: 1px solid var(--studio-line);
        border-radius: 10px;
        padding: 9px 14px;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }
      button:hover { border-color: var(--studio-accent-2); }
      button.primary { background: var(--studio-accent); border-color: var(--studio-accent); color: var(--color-white, #fff); }
      button.link { min-height: auto; border-color: transparent; padding-inline: 4px; color: var(--studio-accent-2); }
      button:disabled { opacity: .6; cursor: wait; }
      button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
        outline: 2px solid var(--color-focus-outline, #0969da);
        outline-offset: 2px;
      }
      .eyebrow, .section-label {
        color: var(--studio-accent);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .eyebrow { margin-bottom: 6px; }
      .section-label { margin: 22px 0 7px; }
      .workspace-intro { margin-bottom: 22px; }
      .workspace-intro p { margin-bottom: 8px; }
      .workspace-meta { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }
      .workspace-path { color: var(--studio-muted); }
      .step { color: var(--canvas-muted, var(--studio-muted)); font-size: 12px; font-weight: 400; margin-bottom: 6px; }
      .field { display: grid; gap: 6px; margin: 16px 0; font-size: var(--canvas-body, 13px); line-height: 18px; font-weight: 500; color: var(--canvas-fg, var(--studio-ink)); }
      input[type="text"], textarea, select {
        width: 100%;
        border: 1px solid var(--studio-line);
        border-radius: 9px;
        padding: 8px 10px;
        background: var(--studio-raised);
        color: inherit;
        font-family: inherit;
        font-size: var(--canvas-body, 13px);
        line-height: 20px;
        font-weight: 400;
      }
      textarea { min-height: 84px; resize: vertical; }
      .choice-list, .capability-list, .mapping-list, .review-list { display: grid; gap: 9px; margin: 16px 0; }
      .choice, .capability, .mapping, .review-row {
        border: 1px solid var(--studio-line);
        border-radius: 10px;
        padding: 12px;
      }
      .capability, .review-row { display: grid; gap: 4px; background: var(--studio-raised); }
      .capability-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
      .capability-head .badge { margin-left: auto; flex: 0 0 auto; }
      .capability strong, .review-row strong { display: block; font-size: var(--canvas-body, 13px); line-height: 18px; font-weight: var(--font-weight-semibold, 600); }
      .capability small, .review-row small { display: block; color: var(--canvas-muted, var(--studio-muted)); font-size: 12px; line-height: 18px; font-weight: 400; }
      .icon-button { flex: 0 0 auto; min-height: 32px; padding: 6px; }
      .icon-button svg { display: block; width: 16px; height: 16px; fill: currentColor; }
      .icon-button.danger { color: var(--fgColor-danger, #cf222e); }
      .surface { margin-bottom: 16px; border: 1px solid var(--studio-line); border-radius: 14px; background: var(--studio-panel); overflow: hidden; }
      .surface-head {
        min-height: 46px;
        padding: 11px 15px;
        border-bottom: 1px solid var(--studio-line);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      details.surface > summary { cursor: pointer; list-style: none; }
      details.surface > summary::-webkit-details-marker { display: none; }
      details.surface > summary::before { content:""; flex:none; width:16px; height:16px; background:currentColor; mask:${octiconMask("chevron-right")} center/contain no-repeat; color:var(--studio-accent); transition:transform .2s; }
      details.surface[open] > summary::before { transform: rotate(90deg); }
      .surface-head h2 { margin: 0; font-size: 13px; font-weight: 650; }
      .surface-head small { color: var(--studio-muted); }
      .surface-body { padding: 15px; }
      .surface-body > p:first-child { margin-top: 0; }
      .subsurface { padding: 13px; border: 1px solid var(--studio-line); border-radius: 10px; background: var(--studio-raised); }
      .subsurface + .subsurface { margin-top: 10px; }
      .subsurface-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
      .subsurface-head small { color: var(--studio-muted); }
      .configuration-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
      .configuration-actions button { min-height: 34px; padding-block: 6px; }
      .command-panel { margin-top: 14px; border: 1px solid #202a3b; border-radius: 10px; overflow: hidden; background: #0b1120; }
      .command-panel > summary {
        cursor: pointer;
        list-style: none;
        padding: 9px 11px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #a9b5ca;
        background: #111a2b;
        font: 600 11px var(--font-mono, "SFMono-Regular", Consolas, monospace);
      }
      .command-panel > summary::-webkit-details-marker { display: none; }
      .command-panel > summary::before { content:""; flex:none; width:16px; height:16px; background:currentColor; mask:${octiconMask("chevron-right")} center/contain no-repeat; color:var(--studio-accent); transition:transform .2s; }
      .command-panel[open] > summary::before { transform: rotate(90deg); }
      .command-summary { margin-left: auto; color: #7f8ca3; font-weight: 400; }
      .command-clear-btn { min-height: 22px; padding: 1px 7px; border-radius: 5px; border: 1px solid #2b384e; background: #162136; color: #c4d0e6; font: 600 10px/1.3 var(--font-sans, system-ui, sans-serif); cursor: pointer; }
      .command-clear-btn:hover { border-color: var(--studio-accent); color: #ffffff; }
      .command-panel pre { margin: 0; min-height: 96px; max-height: 280px; overflow: auto; padding: 11px; color: #dbe5f7; font: 12px/1.55 var(--font-mono, "SFMono-Regular", Consolas, monospace); white-space: pre-wrap; overflow-wrap: anywhere; }
      .command-panel .command-output-line { display: block; padding: 1px 6px; margin: 0 -6px; border-inline-start: 2px solid transparent; border-radius: 3px; }
      .command-panel .command-output-line.is-turn-start { margin-top: 8px; padding-top: 8px; border-top: 1px dashed #2d3b55; border-top-left-radius: 0; border-top-right-radius: 0; }
      .command-panel .command-output-line.is-turn-start[data-turn-label]::before { content: attr(data-turn-label); display: block; margin-bottom: 3px; font: 600 10px/1.2 var(--font-sans, system-ui, sans-serif); letter-spacing: .04em; text-transform: uppercase; color: #8c9bb5; }
      .command-panel .command-output-line.is-error { border-inline-start-color: #f87171; background: rgba(248, 113, 113, 0.12); color: #fecaca; }
      .command-panel .command-output-error-token { display: inline-block; padding: 0 5px; margin: 0 1px; border-radius: 4px; border: 1px solid rgba(248, 113, 113, 0.45); background: rgba(248, 113, 113, 0.18); color: #fca5a5; font-weight: 650; }
      .lifecycle-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .lifecycle-actions button { flex: 1 1 180px; }
      .choice label, .capability label { display: flex; gap: 9px; align-items: start; }
      .choice small, .capability small, .mapping small { display: block; color: var(--studio-muted); }
      .template { display: grid; grid-template-columns: auto 1fr; align-items: start; gap: 10px; padding: 12px 14px; background: var(--studio-raised); cursor: pointer; }
      .template:hover { border-color: var(--studio-accent-2); }
      .template:has(input:checked) { border-color: var(--studio-accent); box-shadow: 0 0 0 1px var(--studio-accent); }
      .template > input { margin-top: 3px; }
      .template > span { display: grid; gap: 4px; font-weight: 400; }
      .template strong { font-size: var(--canvas-body, 13px); line-height: 18px; font-weight: var(--font-weight-semibold, 600); color: var(--canvas-fg, var(--studio-ink)); }
      .template-meta { display: block; color: var(--canvas-muted, var(--studio-muted)); font-size: 12px; line-height: 18px; font-weight: 400; }
      .template-preview-card { margin-top: 16px; padding: 14px 16px; border: 1px solid var(--studio-line); border-radius: 10px; background: var(--studio-panel); display: grid; gap: 11px; }
      :root[data-studio-theme="light"] .template-preview-card { background: #f1f5f9; border-color: #cbd5e1; }
      .template-preview-eyebrow { font-size: 11px; font-weight: 650; letter-spacing: .06em; text-transform: uppercase; color: var(--studio-muted); margin-bottom: 2px; }
      .template-preview-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 8px; }
      .template-preview-head strong { font-size: 13px; font-weight: 650; color: var(--studio-ink); display: block; }
      .template-preview-head small { color: var(--studio-muted); font-size: 12px; display: block; margin-top: 2px; }
      .template-preview-diagram { border: 1px solid var(--studio-line); border-radius: 8px; padding: 10px 12px; background: var(--studio-raised); overflow-x: auto; }
      .template-preview-diagram svg { display: block; width: 100%; height: auto; max-height: 155px; }
      .template-preview-bullets { margin: 0; padding-left: 18px; display: grid; gap: 6px; font-size: 12px; line-height: 1.45; color: var(--studio-muted); }
      .template-preview-bullets li strong { font-weight: 600; color: var(--studio-ink); }
      ${CREATE_FLOW_CSS}
      .badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 7px; }
      .badge { border: 1px solid var(--studio-line); border-radius: 999px; padding: 2px 8px; font-size: 11px; background: var(--studio-panel); }
      .badge.foundry, .badge.hosted-agent, .badge.hosted-skill { background: #f0f6fc; border-color: #b6d4fe; color: #1d4ed8; }
      .badge.http, .badge.embr { background: #f0fdfa; border-color: #99f6e4; color: #0f766e; }
      .badge.mcp, .badge.connector { background: #faf5ff; border-color: #d8b4fe; color: #6b21a8; }
      .badge.docker, .badge.sandbox, .badge.durable { background: #f5f7ff; border-color: #c7d2fe; color: #3730a3; }
      .badge.data, .badge.gateway { background: #f8fafc; border-color: #cbd5e1; color: #334155; }
      .actions { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 24px; }
      .actions-right { display: flex; gap: 8px; margin-left: auto; }
      .topbar { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
      .topbar button { min-height: 32px; padding: 3px 8px; }
      .topbar h1 { margin: 0; }
      .notice, .error {
        border-radius: 9px;
        padding: 10px 12px;
        margin: 14px 0;
        background: var(--true-color-blue-muted, #ddf4ff);
      }
      .error { background: #ffebe9; color: #82071e; }
      .studio-toolkit { margin: 14px 0; }
      .mapping-heading { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
      .mapping select { margin-top: 8px; }
      .source-option { display: block; }
      .local-path { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 16px; }
      .summary { display: grid; gap: 16px; margin: 16px 0; }
      .summary section { border-bottom: 1px solid var(--studio-line); padding-bottom: 14px; }
      .summary section:last-child { border: 0; padding-bottom: 0; }
      .summary section > h3 { margin: 0 0 6px; }
      .summary section > p { margin: 4px 0 0; }
      .summary .review-list { margin: 8px 0 0; }
      .checkbox-field { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: var(--canvas-body, 13px); line-height: 18px; color: var(--canvas-fg, var(--studio-ink)); cursor: pointer; }
      .checkbox-field input[type="checkbox"] { margin: 0; width: 15px; height: 15px; flex: 0 0 auto; }
      .field-hint { margin: 6px 0 0; font-size: 12px; line-height: 18px; color: var(--canvas-muted, var(--studio-muted)); }
      .component-list { display: grid; gap: 8px; margin: 10px 0 0; }
      .component-status { display: grid; grid-template-columns: minmax(130px, auto) 1fr; align-items: center; gap: 8px; }
      .component-status button { min-height: 32px; padding: 5px 9px; text-align: left; font-family: var(--font-mono, monospace); font-size: 12px; overflow-wrap: anywhere; }
      .agent-tester { display: grid; gap: 8px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--studio-line); }
      .agent-tester textarea { min-height: 64px; }
      .agent-response { max-height: 240px; overflow: auto; white-space: pre-wrap; font-family: var(--font-mono, monospace); }
      .map-loading { padding: 24px; text-align: center; color: var(--studio-muted); border: 1px dashed var(--studio-line); border-radius: 10px; }
      .map-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
      .map-expand { min-height: 32px; width: 32px; padding: 6px; color: var(--studio-muted); background: var(--studio-raised); }
      .map-expand:hover { color: var(--studio-accent); }
      .map-expand svg { display: block; width: 18px; height: 18px; fill: currentColor; }
      .app-map-visual { overflow: hidden; padding-bottom: 5px; }
      .map-lanes { display: grid; grid-template-columns: repeat(auto-fit, minmax(165px, 1fr)); align-items: start; gap: 10px; }
      .map-lane {
        min-width: 0;
        padding: 10px;
        border: 1px solid var(--studio-line);
        border-top: 3px solid var(--studio-accent);
        border-radius: 10px;
        background: var(--studio-raised);
      }
      .map-lane-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 9px; }
      .map-lane-head strong { font-size: 12px; }
      .map-lane-head small { color: var(--studio-muted); font-size: 10px; }
      .map-node { padding: 9px; border: 1px solid var(--studio-line); border-radius: 8px; background: var(--studio-panel); }
      .map-node + .map-node { margin-top: 8px; }
      .map-node.operation { border-style: dashed; }
      .map-node strong, .map-node code { display: block; }
      .map-node strong { font-size: 12px; }
      .map-node code { margin-top: 3px; color: var(--studio-muted); font-size: 10px; }
      .map-badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 7px; }
      .map-badge { border: 1px solid var(--studio-line); border-radius: 999px; padding: 1px 6px; background: var(--studio-raised); color: var(--studio-muted); font-size: 9px; line-height: 1.45; }
      .map-badge.hosted-agent, .map-badge.model { border-color: #54aeff; background: #ddf4ff; color: #0550ae; }
      .map-badge.framework, .map-badge.sdk { border-color: #c084fc; background: #f3e8ff; color: #6b21a8; }
      .map-badge.target { border-color: #8b5cf6; background: #ede9fe; color: #5b21b6; }
      .map-badge.bound { border-color: #4ac26b; background: #dafbe1; color: #116329; }
      .map-badge.embr { border-color: #22d3ee; background: #cffafe; color: #155e75; }
      .map-links { display: grid; gap: 5px; margin-top: 8px; padding-top: 7px; border-top: 1px solid var(--studio-line); }
      .map-details { display: grid; gap: 4px; margin-top: 8px; padding-top: 7px; border-top: 1px solid var(--studio-line); }
      .map-detail { display: flex; justify-content: space-between; gap: 8px; color: var(--studio-muted); font-size: 10px; }
      .map-detail b { color: var(--studio-ink); font-weight: 650; text-align: right; overflow-wrap: anywhere; }
      .map-link { display: grid; grid-template-columns: auto 1fr; gap: 5px; color: var(--studio-muted); font-size: 10px; line-height: 1.35; }
      .map-link .arrow { color: var(--studio-accent); font-weight: 700; }
      .map-link b { color: var(--studio-ink); font-weight: 650; }
      .map-link.unresolved { padding: 5px; border: 1px dashed color-mix(in srgb, var(--studio-warn) 55%, var(--studio-line)); border-radius: 6px; }
      .map-link.unresolved .arrow { color: var(--studio-warn); }
      .map-evidence { margin-top: 7px; color: var(--studio-muted); font-size: 9px; overflow-wrap: anywhere; }
      .map-empty { padding: 24px; text-align: center; color: var(--studio-muted); border: 1px dashed var(--studio-line); border-radius: 10px; }
      .map-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-top: 12px; }
      .map-legend { color: var(--studio-muted); font-size: 11px; }
      .tier-list { display: grid; gap: 10px; }
      .tier-card { padding: 13px; border: 1px solid var(--studio-line); border-radius: 10px; background: var(--studio-raised); }
      .tier-card p { margin-bottom: 0; }
      .danger-zone { display: flex; justify-content: flex-end; margin-top: 22px; padding-top: 14px; border-top: 1px solid var(--studio-line); }
      .danger-zone button { color: var(--studio-danger); border-color: color-mix(in srgb, var(--studio-danger) 45%, var(--studio-line)); }
      #status { min-height: 22px; margin-top: 16px; color: var(--studio-muted); }
      #send-agent-prompt svg[data-octicon="agent"] { color: var(--background-color-button-primary-rest, var(--canvas-button-primary-bg, var(--studio-accent))); }
      @media (max-width: 720px) {
        body { padding-inline: 14px; }
        .actions { align-items: stretch; flex-direction: column-reverse; }
        .actions-right, .actions button { width: 100%; }
        .actions-right { flex-direction: column-reverse; }
        .local-path { grid-template-columns: 1fr; }
        .component-status { grid-template-columns: 1fr; }
        .surface-head { align-items: flex-start; flex-direction: column; }
      }
      ${renderThemeStyles(presentation.id)}
      ${renderStudioIntroStyles()}
      .studio-site-nav { display: block; margin: 0 -24px; padding: 0 16px; }
      @media (max-width: 720px) { .studio-site-nav { margin-inline: -14px; } }
      }
    </style>
  </head>
  <body>
    <nav class="studio-site-nav" aria-label="Navigation">
      ${renderThemeToggle(theme,presentation.id)}
    </nav>
    <main>
      <div class="studio-intro-notice" role="status"></div>
      <div id="app"><div id="canvas-controls-loading" class="journey-loading" aria-busy="true"><h1>What would you like to do?</h1><p role="status">Loading Canvas controls...</p>${renderJourneySkeleton()}</div></div>
      <div id="status" role="status" aria-live="polite"></div>
    </main>
    ${intro?renderStudioIntro():""}
    <script>
      (async () => {
      let buttons, headerHandle, controlsDisposed = false;
      window.addEventListener("pagehide", event => {
        if (!event.persisted) { controlsDisposed = true; buttons?.dispose(); headerHandle?.dispose(); }
      });
      const toolkit = await import("/canvas-ui/base.mjs");
      if (controlsDisposed) return;
      buttons = (${createStudioButtons.toString()})(toolkit);
      window.appPlatformButtons = buttons;
      buttons.mountAll(document);
      const utilities = document.querySelector(".studio-theme-control");
      utilities.remove();
      headerHandle = (${mountStudioHeader.toString()})(document.querySelector(".studio-site-nav"), {
        toolkit, utilities, onHome: () => { if (!appBusy) renderLanding(); },
      });
      const apiToken = ${JSON.stringify(apiToken)};
      const AppList = (${createStudioAppList.toString()})(toolkit, {
        getAppPathLabels: ${getAppPathLabels.toString()},
        getAppOpenedLabel: ${getAppOpenedLabel.toString()},
      });
      const appHref = root => "/app-map?root=" + encodeURIComponent(root) + "&token=" + encodeURIComponent(apiToken);
      const capabilities = ${JSON.stringify(capabilities)};
      let editorSettings = ${JSON.stringify(editorSettings).replaceAll("<","\\u003c")};
      let editorPreferenceBusy = false, appBusy = false;
      function focusPrimaryAction(selector = "#next") {
        requestAnimationFrame(() => {
          const target = document.querySelector(selector);
          if (target && !target.disabled && !document.querySelector(".studio-intro")) {
            target.focus({ preventScroll: true });
          }
        });
      }
      window.addEventListener("app-platform-editor-settings-change", (event) => {
        editorSettings = event.detail.settings;
        editorPreferenceBusy = event.detail.busy;
        syncEditorControls();
      });
      function syncEditorControls() {
        const picker = document.getElementById("preferred-editor");
        if (picker) {
          picker.value = editorSettings.editorId;
          picker.disabled = editorPreferenceBusy || appBusy;
          buttons.setDisabled(document.getElementById("next"), editorPreferenceBusy || appBusy);
        }
        const label = document.getElementById("open-editor-label");
        if (label) label.textContent = " Open the new worktree in " +
          editorSettings.editors.find((editor) => editor.id === editorSettings.editorId).label;
      }
      const app = document.getElementById("app");
      const status = document.getElementById("status");
      let homeHandle = null, openAppsHandle = null, existingAppSearch = "", createView = null;
      const templateDrafts = new Map();
      const createGuidance = ${JSON.stringify(CREATE_GUIDANCE).replaceAll("<","\\u003c")};
      const templateKind = (${createTemplateKind.toString()});
      const createProgress = (${renderCreateProgress.toString()});
      const mountCreate = (${mountCreateFlow.toString()});
      function selectedTemplate() { return templates().find(item => item.id === draft.templateRootId); }
      function guidanceFor(template) { return createGuidance[templateKind(template)]; }
      function mountCreateView(step) {
        createView = mountCreate({
          root: app, toolkit, buttons, current: selectedTemplate, guidanceFor, kindFor: templateKind,
          preview: renderTemplatePreviewCard, step,
          onError: error,
        });
      }
      function disposeView() {
        createView?.dispose();
        createView = null;
        homeHandle?.dispose();
        homeHandle = null;
        openAppsHandle?.dispose();
        openAppsHandle = null;
        notices.dispose();
      }
      const notices = (${createStudioNotices.toString()})({
        loadToolkit: () => import("/canvas-ui/base.mjs"),
        onError: (message) => error(message),
      });
      window.addEventListener("pagehide", (event) => {
        if (!event.persisted) disposeView();
      });
      const DEALER_SAMPLE_PURPOSE = "Help car dealers search inventory, evaluate deals, and send offers to buyers.";
      let sources = null;
      let sourcesError = null;
      let sourcesLoading = false, sourceRequest = null, pageVersion = 0;
      let unknownCreationName = null;
      const builtinTemplates = ${JSON.stringify(LOCAL_TEMPLATES2).replaceAll("<","\\u003c")};
      function templates() {
        return [
          ...builtinTemplates.map(builtin => sources?.templates?.find(item => item.id === builtin.id) || builtin),
          ...(sources?.templates || []).filter(item => !builtinTemplates.some(builtin => builtin.id === item.id)),
        ];
      }
      let azureInventory = null;
      let outputTimer = null;
      const draft = {
        journey: null,
        step: 0,
        appName: "",
        nameInstructions: "",
        nameEdited: false,
        purpose: "",
        starterKind: "template",
        templateRootId: "",
        templateInputs: {
          hostedSkillName: "starter-skill",
          egressAllowDomain: "api.lender.example.com",
          agentInstructions: ""
        },
        tierIds: [],
        sourceBindings: {},
        azureBindings: {},
        openInEditor: false
      };

      function escape(value) {
        return String(value ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      async function request(path, options) {
        const requestOptions = { ...(options || {}) };
        requestOptions.headers = { ...(requestOptions.headers || {}), "X-App-Platform-Token": apiToken };
        if (requestOptions.method === "POST") {
          requestOptions.headers["Content-Type"] = "application/json";
        }
        const controller = new AbortController();
        const timer = requestOptions.method === "POST" ? null : setTimeout(() => controller.abort(), 30000);
        try {
          const response = await fetch(path, { ...requestOptions, signal: controller.signal });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload.error || "Request failed.");
          return payload;
        } catch (cause) {
          if (controller.signal.aborted) throw new Error("Loading took too long. Retry to refresh the results.");
          throw cause;
        } finally { clearTimeout(timer); }
      }

      function openAppMap(root, notice = "", initialWorkspace = "") {
        location.assign("/app-map?root=" + encodeURIComponent(root) +
          "&token=" + encodeURIComponent(apiToken) +
          (notice ? "&notice=" + encodeURIComponent(notice) : "") +
          (initialWorkspace === "build" ? "#build" : ""));
      }

      function setBusy(busy, message = "") {
        appBusy = busy;
        refreshAppLists();
        app.querySelectorAll("button, input, textarea, select").forEach((control) => {
          if (!control.closest("#studio-home, #studio-open-apps")) buttons.setDisabled(control, busy);
        });
        syncEditorControls();
        status.textContent = message;
      }

      function homeAppProps() {
        return {
          busy: appBusy,
          recentApps: sources ? sources.apps.filter(item => Number.isFinite(Date.parse(item.lastOpenedAt))) : null,
          appInventory: sources?.apps || [],
          recentError: sourcesError,
          recentLoading: sourcesLoading,
        };
      }

      function refreshAppLists() {
        openAppsHandle?.update({ apps: sources?.apps || [], loadError: sourcesError, loading: sourcesLoading, disabled: appBusy });
        homeHandle?.update(homeAppProps());
      }

      function restoreAppListFocus(root) {
        requestAnimationFrame(() => {
          const trigger = [...app.querySelectorAll("[data-app-actions]")]
            .find(button => button.dataset.appActions === root && !button.disabled);
          (trigger || app.querySelector('#recent-app-search:not(:disabled), [aria-label="Search apps"]:not(:disabled)')
            || app.querySelector('.simple-home-browse:not(:disabled), #top-back, button:not(:disabled)'))?.focus({ preventScroll: true });
        });
      }

      function error(message, fieldId) {
        const feedbackStatus = document.getElementById("create-review-status") || status;
        feedbackStatus.textContent = message;
        feedbackStatus.className = "error";
        if (feedbackStatus !== status) feedbackStatus.setAttribute("role", "alert");
        const field = fieldId && document.getElementById(fieldId);
        if (field) {
          let feedback = document.getElementById(fieldId + "-error");
          if (!feedback) {
            feedback = document.createElement("p");
            feedback.id = fieldId + "-error";
            feedback.className = "create-field-error";
            field.closest(".field").after(feedback);
            const description = field.getAttribute("aria-describedby") || "";
            field.setAttribute("aria-describedby", (description + " " + feedback.id).trim());
            field.addEventListener("input", () => {
              field.removeAttribute("aria-invalid");
              field.setAttribute("aria-describedby", description);
              feedback.remove();
            }, { once: true });
          }
          feedback.textContent = message;
          field.setAttribute("aria-invalid", "true");
          field.focus();
        }
      }

      function clearStatus(message = "") {
        status.className = "";
        status.textContent = message;
      }

      function applyTemplateDefaults(template) {
        if (!template) return;
        const prefix = template.kind === "sample"
          ? "dealer-sample-"
          : (template.id === "builtin-sandbox-gateway-minimal-v1"
              ? "sandbox-starter-"
              : (template.id === "builtin-app-service-builder-ai-gateway-v1"
                  ? "builder-ai-gateway-"
                  : (template.id === "builtin-app-service-builder-vite-v1" ? "builder-vite-" : "app-")));
        if (!draft.appName || /^(dealer-sample|Dealer-sample|sandbox-starter|builder-ai-gateway|builder-vite|app)-[a-z0-9]+$/i.test(draft.appName)) {
          draft.appName = prefix + crypto.randomUUID().slice(0, 6);
        }
        if (template.kind === "sample" && !draft.purpose) {
          draft.purpose = DEALER_SAMPLE_PURPOSE;
        }
      }

      function actions({ back, nextLabel, next, nextDisabled = false }) {
        return '<div class="actions">' +
          (back ? '<button data-studio-button="subtle" type="button" class="link" id="back">Back</button>' : '<span></span>') +
          '<div class="actions-right"><button data-studio-button="primary" type="button" class="primary" id="next"' +
          (nextDisabled ? " disabled" : "") + '>' + escape(nextLabel) + '</button></div></div>';
      }

      function topBack(label = "Back") {
        return '<div class="topbar"><button data-studio-button="subtle" type="button" class="link" id="top-back" aria-label="' +
          escape(label) + '">&#8592; ' + escape(label) + '</button></div>';
      }

      function wireTopBack(back) {
        document.getElementById("top-back")?.addEventListener("click", back);
      }

      function badgeClass(badge) {
        const normalized = badge.toLowerCase();
        if (normalized.includes("foundry")) return "foundry";
        if (normalized.includes("hostedagent")) return "hosted-agent";
        if (normalized.includes("hostedskill")) return "hosted-skill";
        if (normalized === "http") return "http";
        if (normalized === "embr" || normalized.includes("app service builder")) return "embr";
        if (normalized.includes("mcp")) return "mcp";
        if (normalized.includes("connector")) return "connector";
        if (normalized.includes("docker")) return "docker";
        if (normalized.includes("sandbox")) return "sandbox";
        if (normalized.includes("durable")) return "durable";
        if (normalized.includes("direct data")) return "data";
        if (normalized.includes("gateway")) return "gateway";
        return "";
      }

      async function renameApp(root, name, returnFocus) {
        const renamed = await (${showAppRenameDialog.toString()})({ root, name, returnFocus, request, buttons });
        if (renamed === null) return;
        const item = sources?.apps.find(app => app.path === root);
        if (item) item.name = renamed;
        refreshAppLists();
        restoreAppListFocus(root);
        clearStatus("App renamed.");
      }

      async function copyAppPath(root) {
        try {
          await navigator.clipboard.writeText(root);
          clearStatus("Full path copied.");
        } catch (cause) {
          error("Could not copy full path: " + cause.message);
        }
      }

      let deletionInProgress = false;
      async function deleteApp(root, appName, returnFocus) {
        if (deletionInProgress) return;
        deletionInProgress = true;
        const fromList = Boolean(homeHandle || openAppsHandle);
        let deleted = false;
        let result;
        try {
          result = await (${showAppDeleteDialog.toString()})({
            root, name: appName, returnFocus, request, buttons,
            onPending: () => setBusy(true, "Deleting app worktree..."),
          });
          if (!result) return;
          if (!result.worktreeRemoved) { error(result.error); return; }
          deleted = result.worktreeRemoved;
          if (sources) sources = { ...sources, apps: sources.apps.filter(item => item.path !== root) };
          refreshAppLists();
          await loadSources(true);
          if (result.outcome === "partial") error(result.message);
          else clearStatus(result.message);
        } catch (cause) {
          error(deleted ? result.message + " Apps could not be refreshed: " + cause.message : cause.message);
        } finally {
          deletionInProgress = false;
          setBusy(false, status.textContent);
          if (fromList) restoreAppListFocus(root);
          else if (deleted) renderExistingApps();
        }
      }

      function wireActions({ back, next }) {
        document.getElementById("back")?.addEventListener("click", back);
        document.getElementById("next")?.addEventListener("click", next);
      }

      function renderLanding() {
        pageVersion++;
        draft.journey = null;
        clearStatus();
        disposeView();
        buttons.replace(app, '<div id="studio-home"></div>');
        const mount = document.getElementById("studio-home");
        homeHandle = (${mountStudioHome.toString()})(mount, {
          artwork: ${JSON.stringify(homepageArtwork).replaceAll("<","\\u003c")},
          toolkit, AppList, onCreate: beginNewApp, onOpen: beginOpenApp, onAssemble: beginAssembly,
          onOpenRecent: openAppMap, appHref, onCopyPath: copyAppPath, onRename: renameApp, onDelete: deleteApp,
          ...homeAppProps(),
        });
        window.dispatchEvent(new Event("app-platform-home-ready"));
      }

      async function beginNewApp() {
        pageVersion++;
        unknownCreationName = null;
        draft.journey = "new";
        draft.starterKind = "template";
        draft.step = 1;
        if (!templates().some(item => item.id === draft.templateRootId)) draft.templateRootId = templates()[0]?.id || "";
        applyTemplateDefaults(templates().find(item => item.id === draft.templateRootId));
        renderDetails();
      }

      function beginAssembly() {
        pageVersion++;
        draft.journey = "assemble";
        draft.starterKind = "assembly";
        draft.step = 1;
        renderDetails();
      }

      async function beginOpenApp({ preserveSearch = false } = {}) {
        const version = ++pageVersion;
        unknownCreationName = null;
        draft.journey = "open";
        if (!preserveSearch) existingAppSearch = "";
        clearStatus();
        renderExistingApps(true);
        try {
          await loadSources(true);
          if (version === pageVersion) renderExistingApps();
        } catch (cause) {
          if (version === pageVersion) renderExistingApps(false, cause.message);
        }
      }

      function renderExistingApps(loading = sourcesLoading, warning = sourcesError) {
        disposeView();
        const empty = !loading && !warning && (sources?.apps || []).length === 0;
        buttons.replace(app, topBack("Back to Home") + (empty ? "" :
          '<h1>Open an app</h1><p>Select an app to build, run, or inspect.</p>') +
          (!loading && sources?.diagnostics?.length ? '<p role="status">Some source projects could not be inspected. Available apps are shown below.</p>' : "") +
          '<div id="studio-open-apps"></div>');
        openAppsHandle = (${mountStudioOpenApps.toString()})(document.getElementById("studio-open-apps"), {
          toolkit, AppList, apps: sources?.apps || [], initialSearch: existingAppSearch, disabled: appBusy, loading,
          loadingSkeleton: ${JSON.stringify(renderJourneySkeleton())},
          emptyIllustrations: ${JSON.stringify(OPEN_APP_EMPTY_ILLUSTRATIONS).replaceAll("<","\\u003c")},
          onSearchChange: value => { existingAppSearch = value; },
          appHref,
          onCopyPath: copyAppPath, onRename: renameApp, onDelete: deleteApp, onCreate: beginNewApp,
          onRetry: async () => { await beginOpenApp({ preserveSearch: true }); restoreAppListFocus(); }, loadError: warning,
        });
        wireTopBack(renderLanding);
      }

      function captureDetails() {
        const appNameInput = document.getElementById("app-name");
        const purposeInput = document.getElementById("purpose");
        if (appNameInput) draft.appName = appNameInput.value.trim();
        if (purposeInput) draft.purpose = purposeInput.value.trim();
        if (draft.journey === "new") {
          const selected = document.querySelector('input[name="template"]:checked')?.value;
          if (selected) draft.templateRootId = selected;
        }
      }

      function templateCapabilityPills(template) {
        if (template.id === "builtin-sandboxes-minimal-v1") {
          return '<div class="badges">' +
            '<span class="badge hosted-agent">Agent \xB7 1 Brain</span>' +
            '<span class="badge sandbox">Tools \xB7 ACA Sandboxes + Egress Proxy</span>' +
            '</div>';
        }
        if (template.id === "builtin-sandbox-gateway-minimal-v1") {
          return '<div class="badges">' +
            '<span class="badge hosted-agent">Agent \xB7 1 \u2192 2+ Brains</span>' +
            '<span class="badge gateway">Gateway \xB7 AI Gateway</span>' +
            '<span class="badge sandbox">Tools \xB7 ACA Sandboxes</span>' +
            '</div>';
        }
        if (template.id === "builtin-app-service-builder-ai-gateway-v1") {
          return '<div class="badges">' +
            '<span class="badge embr">Web &amp; Agent \xB7 App Service Builder</span>' +
            '<span class="badge gateway">Gateway \xB7 AI Gateway</span>' +
            '</div>';
        }
        if (template.id === "builtin-app-service-builder-vite-v1") {
          return '<div class="badges">' +
            '<span class="badge embr">Web \xB7 App Service Builder</span>' +
            '<span class="badge hosted-skill">+ Optional \xB7 Hosted Skills</span>' +
            '</div>';
        }
        if (template.id === "builtin-empty-starter-v1") {
          return '<div class="badges">' +
            '<span class="badge gateway">Empty Workspace</span>' +
            '<span class="badge hosted-agent">+ Add Building Blocks</span>' +
            '</div>';
        }
        const labelById = {
          web: { label: "Web \xB7 App Service Builder", cls: "embr" },
          agent: { label: template.kind === "sample" ? "Agent \xB7 Foundry Hosted Agent" : "Agent \xB7 Any Compute", cls: "hosted-agent" },
          skills: { label: "Skills \xB7 Azure Functions", cls: "hosted-skill" },
          sandbox: { label: "Tools \xB7 ACA Sandboxes", cls: "sandbox" },
          gateway: { label: "Gateway \xB7 AI Gateway", cls: "gateway" },
          workflows: { label: "Workflows \xB7 Durable Functions", cls: "durable" },
        };
        return '<div class="badges">' + (template.capabilityIds || [])
          .filter((id) => Boolean(labelById[id]))
          .map((id) => {
            const item = labelById[id];
            return '<span class="badge ' + escape(item.cls) + '">' + escape(item.label) + '</span>';
          }).join("") + '</div>';
      }

      function renderTemplatePreviewCard(template) {
        if (!template) return "";
        if (template.id === "builtin-sandboxes-minimal-v1") {
          return '<div class="template-preview-card" data-template-preview-card="' + escape(template.id) + '" role="region" aria-label="Template details">' +
            '<div class="template-preview-head"><div><div class="template-preview-eyebrow">Template details</div><strong>' + escape(template.name) + '</strong>' +
            '<small>2 capabilities \xB7 1 brain calling sandboxed tools (Sandboxes egress proxy)</small></div>' +
            templateCapabilityPills(template) + '</div>' +
            '<div class="template-preview-diagram">' +
            '<svg viewBox="0 0 560 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram: 1 Agent calls Tools in ACA Sandboxes protected by the Sandboxes egress proxy">' +
              '<rect x="12" y="18" width="176" height="84" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.25"/>' +
              '<text x="24" y="41" font-family="sans-serif" font-size="11" font-weight="700" fill="#1e3a8a">Agent (1 Brain)</text>' +
              '<text x="24" y="59" font-family="sans-serif" font-size="10" font-weight="600" fill="#334155">Any Compute</text>' +
              '<text x="24" y="76" font-family="sans-serif" font-size="9" fill="#475569">Local \xB7 ACA \xB7 Functions \xB7 Foundry</text>' +
              '<text x="24" y="91" font-family="sans-serif" font-size="8.5" fill="#64748b">Single caller \xB7 No raw tools on host</text>' +
              '<line x1="188" y1="60" x2="232" y2="60" stroke="#2563eb" stroke-width="1.5"/>' +
              '<polygon points="232,60 224,56 224,64" fill="#2563eb"/>' +
              '<rect x="234" y="10" width="314" height="100" rx="10" fill="#f5f7ff" stroke="#a5b4fc" stroke-width="1.5"/>' +
              '<text x="248" y="32" font-family="sans-serif" font-size="11" font-weight="700" fill="#312e81">Tools (Hands) \xB7 ACA Sandboxes</text>' +
              '<text x="248" y="49" font-family="sans-serif" font-size="9.5" fill="#475569">Ephemeral isolated container/microVM \xB7 Zero host secrets</text>' +
              '<rect x="248" y="60" width="286" height="38" rx="7" fill="#eef2ff" stroke="#6366f1" stroke-width="1.2"/>' +
              '<text x="260" y="77" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#312e81">Sandboxes Egress Proxy (--egress-default Deny)</text>' +
              '<text x="260" y="91" font-family="sans-serif" font-size="8.5" fill="#4338ca">Blocks unauthorized outbound calls \xB7 Explicit allowlist only</text>' +
            '</svg></div>' +
            '<ul class="template-preview-bullets">' +
              '<li><strong>1 Brain, Sandboxed Hands:</strong> When a single agent calls sandboxed tools, you do not need a gateway in front of the tool yet.</li>' +
              '<li><strong>Sandboxes Egress Proxy Safety:</strong> <strong>ACA Sandboxes</strong> isolates execution and enforces <code>--egress-default Deny</code> + an explicit outbound allowlist through the built-in <strong>Sandboxes egress proxy</strong>.</li>' +
              '<li><strong>Upgrade Path to 2+ Brains:</strong> When a second agent or Hosted Skill needs to call the same sandboxed tool, add <strong>AI Gateway</strong> in front of your tools to protect the hands from multiple brains.</li>' +
            '</ul></div>';
        }
        if (template.id === "builtin-sandbox-gateway-minimal-v1") {
          return '<div class="template-preview-card" data-template-preview-card="' + escape(template.id) + '" role="region" aria-label="Template details">' +
            '<div class="template-preview-head"><div><div class="template-preview-eyebrow">Template details</div><strong>' + escape(template.name) + '</strong>' +
            '<small>3 capabilities \xB7 Protecting the hands from multiple brains (1 \u2192 2+ agents &amp; skills)</small></div>' +
            templateCapabilityPills(template) + '</div>' +
            '<div class="template-preview-diagram">' +
            '<svg viewBox="0 0 560 132" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram: 1 to 2+ Agents route all tool and model calls through AI Gateway to ACA Sandboxes (with Sandboxes egress proxy) and Models">' +
              '<rect x="6" y="10" width="144" height="58" rx="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.25"/>' +
              '<text x="16" y="29" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1e3a8a">Agent (Brain 1)</text>' +
              '<text x="16" y="44" font-family="sans-serif" font-size="9.5" font-weight="600" fill="#334155">Any Compute</text>' +
              '<text x="16" y="58" font-family="sans-serif" font-size="8.5" fill="#64748b">Local \xB7 ACA \xB7 Functions \xB7 Foundry</text>' +
              '<rect x="6" y="76" width="144" height="46" rx="9" fill="#f8fafc" stroke="#93c5fd" stroke-width="1.25" stroke-dasharray="4 3"/>' +
              '<text x="16" y="95" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1d4ed8">+ 2nd Agent / Skill</text>' +
              '<text x="16" y="110" font-family="sans-serif" font-size="8.5" fill="#64748b">Ready for 2+ brains</text>' +
              '<line x1="150" y1="39" x2="180" y2="56" stroke="#2563eb" stroke-width="1.4"/>' +
              '<polygon points="180,56 172,54 175,60" fill="#2563eb"/>' +
              '<line x1="150" y1="99" x2="180" y2="78" stroke="#60a5fa" stroke-width="1.3" stroke-dasharray="3 2"/>' +
              '<polygon points="180,78 175,72 172,78" fill="#60a5fa"/>' +
              '<rect x="182" y="20" width="138" height="92" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>' +
              '<text x="194" y="42" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1e3a8a">AI Gateway</text>' +
              '<text x="194" y="57" font-family="sans-serif" font-size="9" font-weight="600" fill="#1d4ed8">Protects Hands &amp; Models</text>' +
              '<text x="194" y="73" font-family="sans-serif" font-size="8.5" fill="#475569">All tool &amp; model calls</text>' +
              '<text x="194" y="87" font-family="sans-serif" font-size="8.5" fill="#475569">Caller auth \xB7 Rate limits</text>' +
              '<text x="194" y="101" font-family="sans-serif" font-size="8.5" fill="#475569">Aliases (gpt-latest) \xB7 Audit</text>' +
              '<line x1="320" y1="48" x2="350" y2="35" stroke="#2563eb" stroke-width="1.4"/>' +
              '<polygon points="350,35 342,34 345,40" fill="#2563eb"/>' +
              '<line x1="320" y1="84" x2="350" y2="97" stroke="#2563eb" stroke-width="1.4"/>' +
              '<polygon points="350,97 345,92 342,98" fill="#2563eb"/>' +
              '<rect x="352" y="6" width="200" height="56" rx="10" fill="#f5f7ff" stroke="#a5b4fc" stroke-width="1.25"/>' +
              '<text x="364" y="25" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#312e81">Tools (Hands) \xB7 ACA Sandboxes</text>' +
              '<text x="364" y="40" font-family="sans-serif" font-size="8.5" fill="#475569">Isolated execution \xB7 Zero host secrets</text>' +
              '<text x="364" y="53" font-family="sans-serif" font-size="8.5" font-weight="600" fill="#4338ca">Sandboxes egress proxy (default-deny)</text>' +
              '<rect x="352" y="70" width="200" height="56" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.25"/>' +
              '<text x="364" y="90" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1e293b">Remote Models</text>' +
              '<text x="364" y="105" font-family="sans-serif" font-size="8.5" fill="#475569">Azure OpenAI / Foundry endpoints</text>' +
              '<text x="364" y="118" font-family="sans-serif" font-size="8.5" fill="#64748b">Shared across all agents &amp; skills</text>' +
            '</svg></div>' +
            '<ul class="template-preview-bullets">' +
              '<li><strong>1 Brain Only? (Sandboxes Minimal):</strong> When a single agent calls sandboxed tools, <strong>ACA Sandboxes</strong> + the <strong>Sandboxes egress proxy</strong> (<code>--egress-default Deny</code>) keep execution and outbound traffic safe on their own.</li>' +
              '<li><strong>Protecting the Hands from Multiple Brains:</strong> Start with 1 agent, but route <strong>all tool calls (including sandboxed tools)</strong> and model calls behind <strong>AI Gateway</strong> so you are ready when a 2nd agent or Hosted Skill calls the same sandboxed tool.</li>' +
              '<li><strong>Defense in Depth:</strong> <strong>AI Gateway</strong> governs inbound caller auth, rate limits, and model aliases (<code>gpt-latest</code>) across brains; <strong>ACA Sandboxes egress proxy</strong> locks down what the tool can reach outbound.</li>' +
            '</ul></div>';
        }
        if (template.id === "builtin-app-service-builder-ai-gateway-v1") {
          return '<div class="template-preview-card" data-template-preview-card="' + escape(template.id) + '" role="region" aria-label="Template details">' +
            '<div class="template-preview-head"><div><div class="template-preview-eyebrow">Template details</div><strong>' + escape(template.name) + '</strong>' +
            '<small>2 capabilities \xB7 Python FastAPI + Agent Framework with AI Gateway</small></div>' +
            templateCapabilityPills(template) + '</div>' +
            '<div class="template-preview-diagram">' +
            '<svg viewBox="0 0 560 116" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram: Web and Agent experience on App Service Builder connected to AI Gateway">' +
              '<rect x="16" y="18" width="236" height="80" rx="10" fill="#f0fdfa" stroke="#5eead4" stroke-width="1.25"/>' +
              '<text x="32" y="43" font-family="sans-serif" font-size="11" font-weight="700" fill="#0f766e">Web &amp; Agent Experience</text>' +
              '<text x="32" y="61" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#334155">App Service Builder</text>' +
              '<text x="32" y="79" font-family="sans-serif" font-size="9.5" fill="#475569">FastAPI + Agent Framework \xB7 Streaming chat</text>' +
              '<line x1="252" y1="58" x2="306" y2="58" stroke="#94a3b8" stroke-width="1.4"/>' +
              '<polygon points="306,58 298,54 298,62" fill="#94a3b8"/>' +
              '<rect x="308" y="18" width="236" height="80" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.25"/>' +
              '<text x="324" y="43" font-family="sans-serif" font-size="11" font-weight="700" fill="#1e293b">Gateway \xB7 AI Gateway</text>' +
              '<text x="324" y="61" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#334155">Governed Model Routing</text>' +
              '<text x="324" y="79" font-family="sans-serif" font-size="9.5" fill="#475569">OpenAI Responses API \xB7 Central auth</text>' +
            '</svg></div>' +
            '<ul class="template-preview-bullets">' +
              '<li><strong>Web &amp; Agent on App Service Builder:</strong> Python FastAPI and Microsoft Agent Framework streaming chat app with root <code>builder.yaml</code>.</li>' +
              '<li><strong>Governed AI Gateway Routing:</strong> Connects directly to Azure AI Gateway for model routing, central auth, and token governance.</li>' +
            '</ul></div>';
        }
        if (template.id === "builtin-app-service-builder-vite-v1") {
          return '<div class="template-preview-card" data-template-preview-card="' + escape(template.id) + '" role="region" aria-label="Template details">' +
            '<div class="template-preview-head"><div><div class="template-preview-eyebrow">Template details</div><strong>' + escape(template.name) + '</strong>' +
            '<small>Web experience starter \xB7 Add Hosted Skills as you grow</small></div>' +
            templateCapabilityPills(template) + '</div>' +
            '<div class="template-preview-diagram">' +
            '<svg viewBox="0 0 560 116" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram: Web experience on App Service Builder with optional Hosted Skills">' +
              '<rect x="16" y="18" width="236" height="80" rx="10" fill="#f0fdfa" stroke="#5eead4" stroke-width="1.25"/>' +
              '<text x="32" y="43" font-family="sans-serif" font-size="11" font-weight="700" fill="#0f766e">Web Experience</text>' +
              '<text x="32" y="61" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#334155">App Service Builder</text>' +
              '<text x="32" y="79" font-family="sans-serif" font-size="9.5" fill="#475569">Vite + TypeScript \xB7 Managed web hosting</text>' +
              '<line x1="252" y1="58" x2="306" y2="58" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4 3"/>' +
              '<polygon points="306,58 298,54 298,62" fill="#94a3b8"/>' +
              '<rect x="308" y="18" width="236" height="80" rx="10" fill="#f8fafc" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="5 4"/>' +
              '<text x="324" y="43" font-family="sans-serif" font-size="11" font-weight="700" fill="#1d4ed8">+ Add Hosted Skills (Optional)</text>' +
              '<text x="324" y="61" font-family="sans-serif" font-size="10.5" font-weight="600" fill="#334155">Azure Functions \xB7 MCP &amp; HTTP</text>' +
              '<text x="324" y="79" font-family="sans-serif" font-size="9.5" fill="#64748b">Attach backend skills in Build when ready</text>' +
            '</svg></div>' +
            '<ul class="template-preview-bullets">' +
              '<li><strong>Web Experience (App Service Builder):</strong> Starts with a clean Vite + TypeScript web frontend and <code>builder.yaml</code> ready for local preview and App Service Builder deployment.</li>' +
              '<li><strong>Expand with Hosted Skills:</strong> Attach callable Azure Functions Hosted Skills (HTTP or MCP) in <strong>Build</strong> whenever your web app needs backend capabilities.</li>' +
            '</ul></div>';
        }
        if (template.id === "builtin-empty-starter-v1") {
          return '<div class="template-preview-card" data-template-preview-card="' + escape(template.id) + '" role="region" aria-label="Template details">' +
            '<div class="template-preview-head"><div><div class="template-preview-eyebrow">Template details</div><strong>' + escape(template.name) + '</strong>' +
            '<small>Blank workspace shell \xB7 Add your own building blocks in Build</small></div>' +
            templateCapabilityPills(template) + '</div>' +
            '<div class="template-preview-diagram">' +
            '<svg viewBox="0 0 560 124" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram: Empty app workspace with dashed placeholders to add your own building blocks">' +
              '<rect x="8" y="10" width="544" height="104" rx="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4"/>' +
              '<text x="24" y="30" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#475569">Empty App Workspace \xB7 Add building blocks in Build</text>' +
              '<rect x="24" y="42" width="122" height="58" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="4 3"/>' +
              '<text x="36" y="67" font-family="sans-serif" font-size="10" font-weight="600" fill="#475569">+ Web Surface</text>' +
              '<text x="36" y="83" font-family="sans-serif" font-size="9" fill="#64748b">App Service Builder</text>' +
              '<rect x="156" y="42" width="122" height="58" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="4 3"/>' +
              '<text x="168" y="67" font-family="sans-serif" font-size="10" font-weight="600" fill="#475569">+ Agent</text>' +
              '<text x="168" y="83" font-family="sans-serif" font-size="9" fill="#64748b">Any Compute</text>' +
              '<rect x="288" y="42" width="122" height="58" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="4 3"/>' +
              '<text x="300" y="67" font-family="sans-serif" font-size="10" font-weight="600" fill="#475569">+ Skills &amp; Tools</text>' +
              '<text x="300" y="83" font-family="sans-serif" font-size="9" fill="#64748b">Functions / Sandbox</text>' +
              '<rect x="420" y="42" width="116" height="58" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="4 3"/>' +
              '<text x="432" y="67" font-family="sans-serif" font-size="10" font-weight="600" fill="#475569">+ AI Gateway</text>' +
              '<text x="432" y="83" font-family="sans-serif" font-size="9" fill="#64748b">Model governance</text>' +
            '</svg></div>' +
            '<ul class="template-preview-bullets">' +
              '<li><strong>Start Clean:</strong> Creates an unopinionated app workspace shell with no pre-baked domain logic.</li>' +
              '<li><strong>Add Building Blocks on Demand:</strong> Use the App Map and Build tab to add Web surfaces, Agents, Hosted Skills, ACA Sandboxes, or Durable Workflows as you need them.</li>' +
              '<li><strong>Custom Domain Contract:</strong> Define your own app purpose and initial instructions from day one.</li>' +
            '</ul></div>';
        }
        return '<div class="template-preview-card" data-template-preview-card="' + escape(template.id) + '" role="region" aria-label="Template details">' +
          '<div class="template-preview-head"><div><div class="template-preview-eyebrow">Template details</div><strong>' + escape(template.name) + '</strong>' +
          '<small>6 capabilities \xB7 End-to-end multi-tier reference sample</small></div>' +
          templateCapabilityPills(template) + '</div>' +
          '<div class="template-preview-diagram">' +
          '<svg viewBox="0 0 560 124" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram: Full-stack Dealership E2E Reference Sample">' +
            '<rect x="8" y="32" width="104" height="60" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.25"/>' +
            '<text x="16" y="56" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1e293b">Web Experience</text>' +
            '<text x="16" y="72" font-family="sans-serif" font-size="9" fill="#475569">Buyer &amp; Dealer UI</text>' +
            '<line x1="112" y1="62" x2="136" y2="62" stroke="#94a3b8" stroke-width="1.4"/>' +
            '<rect x="138" y="32" width="118" height="60" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.25"/>' +
            '<text x="148" y="56" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1e3a8a">Deal-Finder Agent</text>' +
            '<text x="148" y="72" font-family="sans-serif" font-size="9" fill="#475569">Foundry / Local (:8088)</text>' +
            '<line x1="256" y1="45" x2="288" y2="24" stroke="#94a3b8" stroke-width="1.4"/>' +
            '<line x1="256" y1="62" x2="288" y2="62" stroke="#94a3b8" stroke-width="1.4"/>' +
            '<line x1="256" y1="79" x2="288" y2="100" stroke="#94a3b8" stroke-width="1.4"/>' +
            '<rect x="290" y="4" width="262" height="34" rx="7" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.25"/>' +
            '<text x="300" y="25" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1e3a8a">4 MCP Hosted Skills (Inventory, Trade-In, Rates, Docs)</text>' +
            '<rect x="290" y="45" width="262" height="34" rx="7" fill="#f5f7ff" stroke="#a5b4fc" stroke-width="1.25"/>' +
            '<text x="300" y="66" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#312e81">ACA Sandbox Prequal + Durable Loan Approval Workflow</text>' +
            '<rect x="290" y="86" width="262" height="34" rx="7" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.25"/>' +
            '<text x="300" y="107" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1e293b">AI Gateway Model Routing &amp; Governance</text>' +
          '</svg></div>' +
          '<ul class="template-preview-bullets">' +
            '<li><strong>Complete Multi-Service Reference:</strong> Combines Web UI, Foundry Hosted Agent, 4 Azure Functions MCP Hosted Skills, ACA Sandbox PII pre-qualification, Durable Workflows, and AI Gateway.</li>' +
            '<li><strong>End-to-End Tool Calling:</strong> Demonstrates multi-tool agent orchestration across inventory search, trade-in valuation, rate sheets, and deal packet generation.</li>' +
          '</ul></div>';
      }

      function templateHtml() {
        if (templates().length === 0) {
          return '<div class="notice">No hydrateable samples were found in the available worktrees.</div>';
        }
        return (sourcesLoading ? '<p class="journey-progress" role="status"><span class="journey-spinner" aria-hidden="true"></span>Finding reference samples. Starter templates are ready to use.</p>' :
          sourcesError ? '<p role="status">Reference samples could not be refreshed. Starter templates are still available.</p><button data-studio-button="secondary" id="retry-templates" type="button">Retry finding samples</button>' : "") +
          '<div class="create-selection"><fieldset class="create-choices"><legend>Choose a template</legend>' + templates().map((template) =>
          '<article class="create-template"><label class="choice template" data-template-option="' + escape(template.id) + '"><input type="radio" name="template" value="' + escape(template.id) + '"' +
          (draft.templateRootId === template.id ? " checked" : "") + '><span><strong>' + escape(template.name) +
          '</strong><span class="template-meta">' + escape(template.description) +
          '</span></span></label><div class="create-inline-body" data-create-inline="' + escape(template.id) + '" hidden></div></article>').join("") +
          '</fieldset><aside id="template-preview-mount" data-create-context></aside></div>';
      }

      async function loadSources(refresh = false) {
        if (sources && !refresh) return;
        if (sourceRequest) return sourceRequest;
        sourcesLoading = true;
        refreshAppLists();
        sourceRequest = request("/api/sources");
        try {
          sources = await sourceRequest;
          sourcesError = null;
        } catch (cause) {
          sourcesError = cause.message;
          throw cause;
        } finally {
          sourceRequest = null;
          sourcesLoading = false;
          refreshAppLists();
        }
      }

      function renderDetails() {
        clearStatus();
        disposeView();
        const isNew = draft.journey === "new";
        if (isNew && templates().length && !selectedTemplate()) {
          draft.templateRootId = templates()[0].id;
          applyTemplateDefaults(templates()[0]);
        }
        buttons.replace(app, topBack("Back to Home") + (isNew ? createProgress(1) : '<div class="step">Step 1 of 4</div>') +
          '<h1>' + (isNew ? "Create a new app" : "Assemble existing projects") + '</h1>' +
          (isNew
            ? '<p>Select a starter template or reference sample for your new app.</p><div id="templates">' + templateHtml() + '</div>'
            : '<label class="field">App name<input id="app-name" type="text" maxlength="80" value="' +
              escape(draft.appName) + '" placeholder="claims-assistant"></label>' +
              '<label class="field">What should this app do?<textarea id="purpose" maxlength="500" placeholder="Describe the outcome for its users.">' +
              escape(draft.purpose) + '</textarea></label>' +
              '<div class="notice">Next, you will add capabilities and explicitly choose a source project for each one.</div>') +
          (isNew ? '<footer class="create-footer"><p>Creates a new isolated Git worktree. No Azure resources will be created or changed.</p>' : "") +
          actions({ back: !isNew, nextLabel: isNew ? "Continue" : "Choose pieces", nextDisabled: isNew && !templates().length }) +
          (isNew ? '</footer>' : ""));
        document.getElementById("back")?.addEventListener("click", renderLanding);
        wireTopBack(renderLanding);
        document.getElementById("retry-templates")?.addEventListener("click", async () => {
          const version = pageVersion;
          const refresh = loadSources(true);
          renderDetails();
          try { await refresh; } catch (cause) {
            if (version === pageVersion && draft.step === 1) error(cause.message);
          }
          if (version === pageVersion && draft.journey === "new" && draft.step === 1) renderDetails();
        });
        document.querySelectorAll('input[name="template"]').forEach((input) => {
          input.addEventListener("change", () => {
            templateDrafts.set(draft.templateRootId, {
              appName: draft.appName, nameInstructions: draft.nameInstructions, nameEdited: draft.nameEdited,
              purpose: draft.purpose, templateInputs: structuredClone(draft.templateInputs),
            });
            draft.templateRootId = input.value;
            const template = templates().find((item) => item.id === input.value);
            const previous = templateDrafts.get(input.value);
            if (previous) Object.assign(draft, structuredClone(previous));
            else {
              draft.appName = ""; draft.nameInstructions = ""; draft.nameEdited = false;
              draft.purpose = "";
              draft.templateInputs = { ...draft.templateInputs, agentInstructions: "", hostedSkillName: "starter-skill" };
            }
            applyTemplateDefaults(template);
            draft.tierIds = [...template.capabilityIds];
            createView.update();
            clearStatus();
          });
        });
        document.getElementById("app-name")?.addEventListener("input", (event) => {
          draft.appName = event.target.value;
        });
        document.getElementById("purpose")?.addEventListener("input", (event) => {
          draft.purpose = event.target.value;
        });
        document.getElementById("next").addEventListener("click", async () => {
          captureDetails();
          if (isNew) {
            if (!draft.templateRootId) {
              error("Choose a template or sample.");
              return;
            }
            const template = templates().find((item) => item.id === draft.templateRootId);
            applyTemplateDefaults(template);
            draft.tierIds = [...template.capabilityIds];
            draft.step = 2;
            renderCapabilities();
            return;
          }
          if (!draft.appName) {
            error("Enter an app name.");
            return;
          }
          if (!draft.purpose) {
            draft.purpose = "Assist users with governed tools and models.";
          }
          setBusy(true, "Finding source projects in Git worktrees...");
          try {
            await loadSources();
          } catch (cause) {
            error(cause.message);
            return;
          } finally { setBusy(false, status.textContent); }
          draft.step = 2;
          renderPieces();
        });
        if (isNew && templates().length) {
          mountCreateView(1);
          focusPrimaryAction("#next");
        }
      }

      function renderCapabilities() {
        clearStatus();
        disposeView();
        const selectedTemplate = templates().find((item) => item.id === draft.templateRootId);
        const isSample = selectedTemplate?.kind === "sample";
        const isSandboxesMinimal = draft.templateRootId === "builtin-sandboxes-minimal-v1";
        const isSandboxGateway = draft.templateRootId === "builtin-sandbox-gateway-minimal-v1";
        const isAppServiceBuilderAiGateway = draft.templateRootId === "builtin-app-service-builder-ai-gateway-v1";
        const isAppServiceBuilder = draft.templateRootId === "builtin-app-service-builder-vite-v1";
        const instructionsValue = isAppServiceBuilder
          ? (draft.templateInputs.agentInstructions || draft.purpose || "")
          : (draft.templateInputs.agentInstructions || draft.purpose ||
              (isSample
                ? DEALER_SAMPLE_PURPOSE
                : (isSandboxesMinimal
                    ? "Help users validate documents using sandboxed tools."
                    : "Help users validate documents and answer questions using governed tools and models.")));
        const instructionsField = isSample
          ? '<label class="field">What this sample does<textarea id="agent-instructions" maxlength="2000">' +
            escape(instructionsValue) + '</textarea></label>'
          : (isAppServiceBuilder
              ? '<label class="field">Custom instructions (optional)<textarea id="agent-instructions" maxlength="2000" placeholder="Optional: specify a tech stack, theme, or app idea (e.g., &quot;Create a todo app&quot;)">' +
                escape(instructionsValue) + '</textarea></label>'
              : '<label class="field">App instructions<textarea id="agent-instructions" maxlength="2000" placeholder="Describe what the app does and how the agent should help, without inventing tool results.">' +
                escape(instructionsValue) + '</textarea></label>');
        const instructionHelp = isAppServiceBuilder
          ? "Leave blank to create the default Fluent 2 Vite starter. Add a stack, theme, or app idea to trigger automatic agent customization with the bundled Fluent theme and spot illustration skills."
          : guidanceFor(selectedTemplate).editing;
        const namingHelp = isAppServiceBuilder
          ? "Custom instructions are used to suggest a name. Without them, the generated builder-vite name is kept."
          : "AI will suggest a name from these instructions. You can rename it in review.";
        const secondField = (!isSandboxGateway && !isSandboxesMinimal && !isAppServiceBuilderAiGateway && !isAppServiceBuilder && !isSample)
          ? '<label class="field">Empty Hosted Skill name<input id="skill-name" type="text" maxlength="40" value="' +
            escape(draft.templateInputs.hostedSkillName) + '" placeholder="starter-skill"></label>'
          : "";
        buttons.replace(app, topBack("Back") + createProgress(2) + '<div class="create-configure"><h1>Describe your app</h1>' +
          '<p class="create-configure-context">' + escape(selectedTemplate.name) + '</p>' +
          '<section class="create-form">' +
          instructionsField +
          '<p class="create-field-help" id="create-instruction-help">' + escape(instructionHelp) + '</p>' +
          '<p class="create-field-help">' + escape(namingHelp) + '</p>' +
          secondField +
          '</section>' +
          '<footer class="create-footer">' +
          '<div class="studio-toolkit" id="review-notice">Creates a new Git worktree. No Azure resources are provisioned.</div>' +
          actions({ back: true, nextLabel: "Review app" }) + '</footer></div>');
        notices.renderNotice(document.getElementById("review-notice"), {
          children: "Creates a new Git worktree. No Azure resources are provisioned.",
          intent: "info",
        });
        document.getElementById("agent-instructions").addEventListener("input", (event) => {
          draft.templateInputs.agentInstructions = event.target.value;
          draft.purpose = event.target.value.trim().slice(0, 500);
        });
        document.getElementById("agent-instructions").setAttribute("aria-describedby", "create-instruction-help");
        document.getElementById("skill-name")?.addEventListener("input", event => {
          draft.templateInputs.hostedSkillName = event.target.value;
        });
        wireActions({
          back: renderDetails,
          next: () => {
            const instructions = document.getElementById("agent-instructions").value.trim();
            if (!instructions && !isAppServiceBuilder) {
              error("Enter instructions for the app.", "agent-instructions");
              return;
            }
            draft.templateInputs.agentInstructions = instructions;
            draft.purpose = instructions ? instructions.slice(0, 500) : "";
            if (!isSandboxGateway && !isSandboxesMinimal && !isAppServiceBuilderAiGateway && !isAppServiceBuilder && !isSample) {
              draft.templateInputs.hostedSkillName = document.getElementById("skill-name").value.trim();
              if (!/^[a-z][a-z0-9-]{0,39}$/.test(draft.templateInputs.hostedSkillName)) {
                error("Enter a lowercase Hosted Skill name using letters, numbers, or hyphens.", "skill-name");
                return;
              }
            }
            renderCreateReview();
          }
        });
        wireTopBack(renderDetails);
        focusPrimaryAction("#next");
      }

      function renderCreateReview() {
        clearStatus();
        disposeView();
        const template = selectedTemplate(), guidance = guidanceFor(template);
        const isAppServiceBuilder = template.id === "builtin-app-service-builder-vite-v1";
        const instructions = draft.templateInputs.agentInstructions.trim();
        applyTemplateDefaults(template);
        let naming = false;
        let nameReady = draft.nameEdited || (isAppServiceBuilder && !instructions) ||
          (Boolean(instructions) && draft.nameInstructions === instructions);
        const instructionsSummary = isAppServiceBuilder && !instructions
          ? "Default Vite starter (no custom instructions)"
          : instructions;
        buttons.replace(app, topBack("Back") + createProgress(3) +
          '<section class="create-review create-review-copy" aria-labelledby="create-review-title">' +
          '<h1 id="create-review-title" tabindex="-1">Review app</h1>' +
          '<div id="create-review-status" role="status" aria-live="polite"></div>' +
          '<button data-studio-button="secondary" type="button" id="retry-name" hidden>Retry naming</button>' +
          '<div class="summary"><section><label class="field">App name<input id="app-name" type="text" maxlength="80" value="' +
          escape(nameReady ? draft.appName : "") + '"></label><h3>Instructions</h3><p>' + escape(instructionsSummary) +
          '</p></section><section><h3>Starter</h3><p>' + escape(template.name) +
          '</p><p class="create-caution">' + escape(guidance.caution) + '</p>' +
          (template.id === "builtin-empty-starter-v1" ? '<p>Empty Hosted Skill name: <code>' + escape(draft.templateInputs.hostedSkillName) + '</code></p>' : "") +
          '</section><section><h3>Included now</h3><dl class="create-review-capabilities">' +
          guidance.included.map(([name, role]) => '<div><dt>' + escape(name) + '</dt><dd>' + escape(role) + '</dd></div>').join("") +
          '</dl></section><section><h3>Workspace</h3>' +
          '<p>New isolated Git worktree. Selected sources are copied or hydrated; source locations are never modified.</p>' +
          '<p>No Azure resources will be created or changed.</p></section></div>' +
          '<footer class="create-footer">' + actions({ back: true, nextLabel: "Create app", nextDisabled: !nameReady }) +
          '</footer></section>');
        const review = document.querySelector(".create-review");
        const nameField = document.getElementById("app-name");
        const feedback = document.getElementById("create-review-status");
        const retry = document.getElementById("retry-name");
        const back = () => { if (!appBusy && !naming) renderCapabilities(); };
        nameField.addEventListener("input", () => { draft.appName = nameField.value; draft.nameEdited = true; });
        async function suggestName() {
          if (naming || !review.isConnected) return;
          naming = true;
          feedback.className = "";
          feedback.setAttribute("role", "status");
          feedback.textContent = "Suggesting an app name...";
          nameField.placeholder = "Generating app name...";
          retry.hidden = true;
          review.setAttribute("aria-busy", "true");
          setBusy(true);
          try {
            const result = await request("/api/app-name", { method: "POST", body: JSON.stringify({ instructions }) });
            if (typeof result.name !== "string" || !${APP_NAME_PATTERN2}.test(result.name)) {
              throw new Error("AI returned an invalid app name. Retry naming.");
            }
            draft.appName = result.name;
            draft.nameInstructions = instructions;
            nameField.value = result.name;
            nameReady = true;
            feedback.textContent = "";
          } catch (cause) {
            error(cause.message);
            retry.hidden = false;
          } finally {
            naming = false;
            nameField.removeAttribute("placeholder");
            review.removeAttribute("aria-busy");
            setBusy(false);
            buttons.setDisabled(document.getElementById("next"), !nameReady);
            buttons.setDisabled(nameField, !nameReady);
            (nameReady ? nameField : retry).focus({ preventScroll: true });
          }
        }
        retry.addEventListener("click", suggestName);
        wireActions({ back, next: async () => {
          if (appBusy || naming || !nameReady || window.__appPlatformSubmitting) return;
          const name = nameField.value.trim();
          if (!${APP_NAME_PATTERN2}.test(name)) {
            error("Use 1 to 80 characters, starting with a letter or number; letters, numbers, spaces, dots, underscores or hyphens only.", "app-name");
            return;
          }
          feedback.textContent = "";
          draft.appName = name;
          await submit();
          if (review.isConnected && !appBusy) focusPrimaryAction("#next");
        } });
        wireTopBack(back);
        document.getElementById("create-review-title").focus({ preventScroll: true });
        if (!nameReady) void suggestName();
      }

      function availableForTier(tierId) {
        return (sources?.roots ?? []).flatMap((root) =>
          root.implementations
            .filter((implementation) => implementation.tierId === tierId)
            .map((implementation) => ({ root, implementation })));
      }

      function renderPieces() {
        notices.dispose();
        clearStatus();
        const unused = capabilities.filter((tier) => !draft.tierIds.includes(tier.id));
        buttons.replace(app, topBack("Back") + '<div class="step">Step 2 of 4</div><h1>Choose pieces</h1>' +
          '<p>Add a capability, then choose the source project that should implement it.</p>' +
          '<div class="mapping-list">' + draft.tierIds.map((tierId) => {
            const tier = capabilities.find((item) => item.id === tierId);
            const options = availableForTier(tierId);
            const selected = draft.sourceBindings[tierId] || "";
            return '<div class="mapping"><div class="mapping-heading"><div><h3>' + escape(tier.name) +
              '</h3><small>' + escape(tier.role) + '</small></div><button data-studio-button="subtle" type="button" class="link" data-remove="' +
              tierId + '">Remove</button></div><select data-source-tier="' + tierId + '">' +
              '<option value="">Choose source project\u2026</option>' + options.map(({ root, implementation }) =>
                '<option value="' + implementation.id + '"' + (selected === implementation.id ? " selected" : "") + '>' +
                escape(root.name + " \xB7 " + (root.branch || "detached") + " \xB7 " + root.path + " \xB7 " + implementation.projectPath +
                  (root.dirty ? " \xB7 Modified" : " \xB7 Clean")) + '</option>').join("") +
              '</select>' + (options.length === 0 ? '<small>No matching project found. Add a local folder below.</small>' : '') +
              '</div>';
          }).join("") + '</div>' +
          (unused.length
            ? '<label class="field">Add capability<select id="add-tier"><option value="">Choose capability\u2026</option>' +
              unused.map((tier) => '<option value="' + tier.id + '">' + escape(tier.name) + '</option>').join("") +
              '</select></label>'
            : "") +
          '<div class="local-path"><input id="local-path" type="text" placeholder="/path/to/repository-or-folder">' +
          '<button data-studio-button="secondary" type="button" id="add-path">Add local path</button></div>' +
          actions({ back: true, nextLabel: "Continue to Azure resources" }));
        document.getElementById("add-tier")?.addEventListener("change", (event) => {
          if (event.target.value) {
            draft.tierIds.push(event.target.value);
            renderPieces();
          }
        });
        document.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
          draft.tierIds = draft.tierIds.filter((id) => id !== button.dataset.remove);
          delete draft.sourceBindings[button.dataset.remove];
          renderPieces();
        }));
        document.querySelectorAll("[data-source-tier]").forEach((select) => select.addEventListener("change", () => {
          draft.sourceBindings[select.dataset.sourceTier] = select.value;
        }));
        document.getElementById("add-path").addEventListener("click", async () => {
          const path = document.getElementById("local-path").value.trim();
          if (!path) {
            error("Enter a local repository or folder path.");
            return;
          }
          setBusy(true, "Scanning the selected folder\u2026");
          try {
            sources = await request("/api/sources", { method: "POST", body: JSON.stringify({ path }) });
            clearStatus("Local folder added.");
            renderPieces();
          } catch (cause) {
            error(cause.message);
          } finally {
            setBusy(false, status.textContent);
          }
        });
        wireActions({
          back: renderDetails,
          next: async () => {
            if (draft.tierIds.length === 0) {
              error("Add at least one capability.");
              return;
            }
            const missing = draft.tierIds.find((tierId) => !draft.sourceBindings[tierId]);
            if (missing) {
              error("Choose a source project for " + capabilities.find((item) => item.id === missing).name + ".");
              return;
            }
            setBusy(true, "Loading compatible Azure resources\u2026");
            try {
              azureInventory = await request("/api/discovery?azure=true");
              draft.step = 3;
              renderAzure();
            } catch (cause) {
              azureInventory = null;
              draft.step = 3;
              renderAzure(cause.message);
            } finally { setBusy(false, status.textContent); }
          }
        });
        wireTopBack(renderDetails);
      }

      function azureForTier(tierId) {
        return azureInventory?.inventory
          ?.find((tier) => tier.id === tierId)
          ?.implementations.filter((item) => item.kind === "azure-resource") ?? [];
      }

      function renderAzure(warning = "") {
        clearStatus();
        notices.dispose();
        buttons.replace(app, topBack("Back") + '<div class="step">Step 3 of 4</div><h1>Map Azure resources <small>(optional)</small></h1>' +
          '<p>These mappings are references only. Azure App Platform will not read keys, deploy, or change resources.</p>' +
          (warning ? '<div class="notice">' + escape(warning) + ' You can continue without Azure mappings.</div>' : "") +
          '<div class="mapping-list">' + draft.tierIds.map((tierId) => {
            const tier = capabilities.find((item) => item.id === tierId);
            const resources = azureForTier(tierId);
            return '<div class="mapping"><h3>' + escape(tier.name) + '</h3><select data-azure-tier="' + tierId + '">' +
              '<option value="">No resource mapped</option>' + resources.map((resource) =>
                '<option value="' + escape(resource.resourceId) + '"' +
                (draft.azureBindings[tierId] === resource.resourceId ? " selected" : "") + '>' +
                escape(resource.title + " \xB7 " + resource.subtitle) + '</option>').join("") + '</select></div>';
          }).join("") + '</div>' +
          actions({ back: true, nextLabel: "Review app" }));
        document.querySelectorAll("[data-azure-tier]").forEach((select) => select.addEventListener("change", () => {
          draft.azureBindings[select.dataset.azureTier] = select.value;
        }));
        wireActions({
          back: renderPieces,
          next: () => {
            draft.step = 4;
            renderReview();
          }
        });
        wireTopBack(renderPieces);
      }

      function capabilityReview(tierId) {
        const tier = capabilities.find((item) => item.id === tierId);
        const sourceId = draft.journey === "assemble" ? draft.sourceBindings[tierId] : null;
        const selected = sourceId
          ? sources.roots.flatMap((root) => root.implementations.map((implementation) => ({ root, implementation })))
              .find((item) => item.implementation.id === sourceId)
          : null;
        const isSandboxesMinimal = draft.journey === "new" && draft.templateRootId === "builtin-sandboxes-minimal-v1";
        const isSandboxGateway = draft.journey === "new" && draft.templateRootId === "builtin-sandbox-gateway-minimal-v1";
        const isAppServiceBuilderAiGateway = draft.journey === "new" && draft.templateRootId === "builtin-app-service-builder-ai-gateway-v1";
        const isSandboxPattern = isSandboxGateway || isSandboxesMinimal;
        const isAppServiceBuilder = draft.journey === "new" && draft.templateRootId === "builtin-app-service-builder-vite-v1";
        const isSample = templates().find((item) => item.id === draft.templateRootId)?.kind === "sample";
        const badgeByTier = {
          web: { label: "App Service Builder", className: "embr" },
          agent: isSandboxPattern
            ? { label: "Any Compute", className: "hosted-agent" }
            : (isSample ? { label: "Foundry Hosted Agent", className: "hosted-agent" } : { label: "Any Compute", className: "hosted-agent" }),
          gateway: { label: "AI Gateway", className: "gateway" },
          skills: { label: "Azure Functions", className: "hosted-skill" },
          sandbox: { label: "ACA Sandboxes", className: "sandbox" },
          workflows: { label: "Durable Functions", className: "durable" },
        };
        const badge = badgeByTier[tierId] || null;
        const displayTierName = isSandboxPattern && tierId === "sandbox" ? "Tools" : tier.name;
        const detail = selected
          ? selected.root.name + " \xB7 " + selected.implementation.projectPath
          : (isSandboxesMinimal && tierId === "agent"
              ? "Orchestrates the workflow on any compute without running untrusted tools in-process"
              : (isSandboxPattern && tierId === "sandbox"
                  ? "Runs untrusted document validation and code in isolated ACA Sandboxes with configured egress controls"
                  : (isSandboxGateway && tierId === "agent"
                      ? "Orchestrates the workflow on any compute (local, ACA, Functions, or Foundry) without running untrusted tools in-process"
                      : (isSandboxGateway && tierId === "gateway"
                          ? "Governed model routing (gpt-latest), rate limits, token budgets, and centralized credentials"
                          : (isAppServiceBuilderAiGateway && tierId === "web"
                              ? "Python FastAPI + Microsoft Agent Framework streaming chat app with root builder.yaml and /health endpoint"
                              : (isAppServiceBuilderAiGateway && tierId === "gateway"
                                  ? "Governed OpenAI Responses API model routing, central auth, and token telemetry via AI Gateway"
                                  : (isAppServiceBuilder && tierId === "web"
                                      ? "Vite + TypeScript static frontend with root builder.yaml (output: dist) and /health endpoint"
                                      : (isSample
                                          ? tier.role
                                          : (tierId === "skills" ? "One empty Hosted Skill" : tier.role)))))))));
        return '<div class="review-row"><div class="capability-head"><strong>' + escape(displayTierName) + '</strong>' +
          (badge ? '<span class="badge ' + escape(badge.className) + '">' + escape(badge.label) + '</span>' : '') +
          '</div><small>' + escape(detail) +
          (draft.azureBindings[tierId] ? "<br>Azure resource mapped" : "") + '</small></div>';
      }

      function renderReview() {
        clearStatus();
        notices.dispose();
        const selectedTemplate = templates().find((item) => item.id === draft.templateRootId);
        const isSandboxesMinimal = draft.journey === "new" && draft.templateRootId === "builtin-sandboxes-minimal-v1";
        const isSandboxGateway = draft.journey === "new" && draft.templateRootId === "builtin-sandbox-gateway-minimal-v1";
        const isAppServiceBuilderAiGateway = draft.journey === "new" && draft.templateRootId === "builtin-app-service-builder-ai-gateway-v1";
        const isAppServiceBuilder = draft.journey === "new" && draft.templateRootId === "builtin-app-service-builder-vite-v1";
        const total = draft.journey === "new" ? 2 : 4;
        const starter = draft.journey === "assemble"
          ? "Assembled from selected source projects"
          : selectedTemplate?.name;
        const reviewTiers = isSandboxesMinimal
          ? ["agent", "sandbox"]
          : isSandboxGateway
            ? ["agent", "sandbox", "gateway"]
            : isAppServiceBuilderAiGateway
              ? ["web", "gateway"]
              : isAppServiceBuilder ? ["web"] : draft.tierIds;
        const createButtonLabel = draft.journey === "assemble"
          ? "Create assembled app"
          : (selectedTemplate?.kind === "sample"
              ? "Create runnable sample"
              : ((isSandboxGateway || isSandboxesMinimal || isAppServiceBuilderAiGateway || isAppServiceBuilder) ? "Create starter app" : "Create empty app"));
        buttons.replace(app, topBack("Back") + '<div class="step">Step ' + total + ' of ' + total + '</div><h1>Review app</h1>' +
          '<div class="summary"><section><h3>App</h3><p><strong>' + escape(draft.appName) + '</strong></p>' +
          (draft.purpose ? '<p>' + escape(draft.purpose) + '</p>' : '') +
          '</section><section><h3>Starter</h3><p>' + escape(starter) +
          '</p></section><section><h3>Capabilities</h3><div class="review-list">' +
          reviewTiers.map(capabilityReview).join("") + '</div></section><section><h3>Workspace</h3>' +
          '<p>New isolated Git worktree. Selected sources are copied or hydrated; source locations are never modified.</p>' +
          '</section></div>' +
          '<div class="studio-toolkit" id="review-notice">No Azure resources will be created or changed.</div>' +
          actions({ back: true, nextLabel: createButtonLabel }));
        notices.renderNotice(document.getElementById("review-notice"), {
          children: "No Azure resources will be created or changed.",
          intent: "info",
        });
        wireActions({
          back: draft.journey === "assemble" ? renderAzure :
            (selectedTemplate?.kind === "sample" ? renderDetails : renderCapabilities),
          next: submit
        });
        wireTopBack(draft.journey === "assemble" ? renderAzure :
          (selectedTemplate?.kind === "sample" ? renderDetails : renderCapabilities));
        focusPrimaryAction("#next");
      }

      function appMapVisual(appMap) {
        if (!appMap) {
          return '<div class="map-loading">Tracing components and relationships from source\u2026</div>';
        }
        return appMap.renderedHtml || '<div class="map-loading">Map rendering is unavailable. Refresh to retry.</div>';
      }

      function renderInventory(result, inventory, appMap) {
         notices.dispose();
         if (outputTimer) {
           clearInterval(outputTimer);
           outputTimer = null;
         }
        const tiers = inventory?.inventory || [];
        const implemented = tiers.filter((tier) => tier.implementations.length > 0).length;
        const graphSummary = appMap
          ? appMap.nodes.length + " nodes \xB7 " + appMap.edges.length + " edges"
          : "Not traced yet";
        buttons.replace(app, topBack("Existing apps") +
          '<header class="workspace-intro"><div class="eyebrow">App workspace</div><h1>' + escape(draft.appName) +
          '</h1><p>' + escape(draft.purpose) + '</p><div class="workspace-meta"><span class="badge">' +
          implemented + ' of ' + tiers.length + ' tiers discovered</span><code class="workspace-path">' +
          escape(result.worktreePath || "Unavailable") + '</code></div></header>' +
          '<div class="section-label">Configure</div>' +
          '<details class="surface configuration-region" open><summary class="surface-head"><h2 id="configuration-title">Azure configuration</h2><small>Optional cloud bindings</small></summary>' +
          '<div class="surface-body"><div class="subsurface gateway-card"><div class="subsurface-head"><h3>AI Gateway</h3>' +
          '<small id="gateway-summary">Discovering gateways\u2026</small></div>' +
          '<p>Selecting a gateway configures this app automatically with its endpoint, key, and model settings.</p>' +
          '<div id="gateway-binding"></div><div class="configuration-actions">' +
          '<button data-studio-button="secondary" type="button" id="configure-gateway">Create / Manage</button></div></div>' +
          '<div class="lifecycle-actions">' +
          '<button data-studio-button="secondary" type="button" data-app-command="provision-cloud">Provision with azd</button>' +
          '<button data-studio-button="secondary" type="button" data-app-command="deploy-cloud">Deploy with azd up</button></div></div></details>' +
          '<div class="section-label">Run</div>' +
          '<details class="surface runtime-region" open><summary class="surface-head"><h2 id="runtime-title">Local runtime</h2>' +
          '<div class="badges" id="local-status"><span class="badge">Checking</span></div></summary>' +
          '<div class="surface-body"><div id="local-guidance"></div>' +
          '<div class="lifecycle-actions"><button data-studio-button="primary" type="button" class="primary" id="local-action" data-app-command="run-local">Run locally</button></div>' +
          '<div class="component-list" id="entrypoints"></div><div id="component-actions"></div>' +
          '<details class="command-panel" id="local-command-panel"><summary><span>Command output</span>' +
          '<span class="command-summary" id="local-command-summary">Idle</span>' +
          '<button type="button" class="command-clear-btn" id="clear-local-output" title="Clear command output">Clear</button></summary>' +
          '<pre id="local-output">Waiting for local app output.</pre></details></div></details>' +
          '<div class="section-label">Observe/Map</div>' +
          '<details class="surface app-map-region" open><summary class="surface-head">' +
          '<h2 id="app-map-title">App Map</h2><small>' + escape(graphSummary) + '</small></summary>' +
          '<div class="surface-body"><div class="map-toolbar"><button data-studio-button="secondary" type="button" class="icon-button map-expand" id="open-app-map"' +
          (appMap ? "" : " disabled") + ' aria-label="Open expanded App Map" title="Open expanded App Map">' +
          ${JSON.stringify(renderOcticon("link-external"))} + '</button></div>' +
          appMapVisual(appMap) +
          '<div class="configuration-actions"><button data-studio-button="secondary" type="button" id="trace-app">' +
          (appMap ? "Refresh map" : "Tracing\u2026") + '</button></div></div></details>' +
          '<div class="section-label">Inspect</div>' +
          '<details class="surface specialist-region"><summary class="surface-head">' +
          '<h2 id="specialist-title">Specialist studios</h2></summary><div class="surface-body"><p>' +
          escape((result.specialistCanvases || []).join(", ") || "No specialist studios are registered for this workspace.") +
          '</p></div></details>' +
          '<details class="surface inventory-region"><summary class="surface-head">' +
          '<h2 id="inventory-title">Components by tier</h2><small>Evidence-derived inventory</small></summary>' +
          '<div class="surface-body"><div class="tier-list">' +
          tiers.map((tier) => '<div class="tier-card"><div class="mapping-heading"><h3>' + escape(tier.name) +
            '</h3><button data-studio-button="subtle" type="button" class="link" data-tier-action="' + escape(tier.id) + '">Deep dive</button></div>' +
            '<small>' + escape(tier.role || "") + '</small><p><strong>' +
            escape(tier.implementationState === "referenced-not-provisioned"
              ? "Referenced by source; not provisioned"
              : tier.implementationState === "missing" ? "Not discovered" : "Observed") +
            '</strong><br>' +
            (tier.implementations.length > 0
              ? escape(tier.implementations.length + " discovered implementation(s)") +
                tier.implementations.map((item) =>
                  '<br><strong>' + escape(item.title) + '</strong> \xB7 ' + escape(item.kind) +
                  (item.badges?.length ? '<div class="badges">' + item.badges.map((badge) =>
                    '<span class="badge ' + badgeClass(badge) + '">' + escape(badge) + '</span>').join("") + '</div>' : '') +
                  '<br><code>' + escape(item.subtitle || item.projectPath || item.resourceId || "") + '</code>' +
                  (item.matchedFiles?.length
                    ? '<br><small>Source files: ' + escape(item.matchedFiles.map((evidence) =>
                      evidence.path + ":" + evidence.line).join(" \xB7 ")) + '</small>'
                    : '') +
                  (item.kind === "source-project"
                    ? '<br><button data-studio-button="secondary" type="button" data-open-source="' + escape(item.projectPath) + '">Open source</button>'
                    : '')).join("")
              : 'No implementation discovered yet \xB7 scaffold available') +
            '</p></div>').join("") + '</div></div></details>' +
          '<div class="danger-zone"><button type="button" id="delete-app">Delete app</button></div>');
         wireTopBack(async () => {
          if (!sources) await loadSources();
          renderExistingApps();
         });
        document.querySelectorAll("[data-open-source]").forEach((button) => button.addEventListener("click", async () => {
          setBusy(true, "Opening component source in your code editor\u2026");
          try {
            const opened = await request("/api/open-source", {
              method: "POST",
              body: JSON.stringify({ root: result.worktreePath, projectPath: button.dataset.openSource })
            });
            clearStatus("Source opened in " + opened.editorLabel + ".");
          } catch (cause) {
            error(cause.message);
          } finally {
            setBusy(false, status.textContent);
          }
        }));
        async function refreshLocalStatus() {
          try {
            const state = await request("/api/app-status?root=" + encodeURIComponent(result.worktreePath));
            const running = state.state === "running";
            const stopping = state.state === "stopping";
            document.getElementById("local-status").innerHTML =
              '<span class="badge ' + (running ? "http" : "") + '">' + escape(state.state || "stopped") + '</span>';
            const commandSummary = document.getElementById("local-command-summary");
            if (commandSummary) commandSummary.textContent = stopping ? "Stopping\u2026" : (running ? "Running" : "Idle");
            if ((running || stopping) && document.getElementById("local-command-panel")) {
              document.getElementById("local-command-panel").open = true;
            }
             buttons.replace(document.getElementById("entrypoints"), (state.entrypoints || []).map((entrypoint) =>
              '<div class="component-status"><span class="badge ' + (entrypoint.ready ? "http" : "") + '">' +
              escape(entrypoint.name) + ': ' + (entrypoint.ready ? "ready" : "offline") + '</span>' +
              '<button data-studio-button="secondary" type="button" data-entrypoint-port="' + entrypoint.port + '"' +
              (entrypoint.ready ? "" : " disabled") + '>' + escape(entrypoint.url) + '</button></div>').join(""));
             document.querySelectorAll("[data-entrypoint-port]").forEach((button) => button.addEventListener("click", async () => {
               try {
                 await request("/api/open-entrypoint", {
                   method: "POST",
                   body: JSON.stringify({ root: result.worktreePath, port: Number(button.dataset.entrypointPort) })
                 });
               } catch (cause) {
                 error(cause.message);
               }
             }));
             const agentReady = (state.entrypoints || []).some((entrypoint) => entrypoint.port === 8088 && entrypoint.ready);
             const componentActions = document.getElementById("component-actions");
             if (agentReady && !componentActions.querySelector(".agent-tester")) {
               buttons.replace(componentActions, '<div class="agent-tester"><strong>Invoke agent</strong>' +
                 '<textarea id="agent-prompt" maxlength="2000" placeholder="Send a message to the running agent"></textarea>' +
                 '<div><button data-studio-button="secondary" type="button" id="send-agent-prompt">' +
                 ${JSON.stringify(renderOcticon("agent"))} + 'Invoke agent</button> ' +
                 '<button data-studio-button="secondary" type="button" id="open-agent-studio">Open agent studio</button></div>' +
                 '<pre class="agent-response" id="agent-response"></pre></div>');
               document.getElementById("send-agent-prompt").addEventListener("click", async () => {
                 const prompt = document.getElementById("agent-prompt").value.trim();
                 if (!prompt) return error("Enter a message for the local agent.");
                 setBusy(true, "Waiting for the local agent\u2026");
                 try {
                   const reply = await request("/api/agent-invoke", {
                     method: "POST",
                     body: JSON.stringify({ root: result.worktreePath, message: prompt })
                   });
                   document.getElementById("agent-response").textContent =
                     typeof reply.response === "string" ? reply.response : JSON.stringify(reply.response, null, 2);
                   clearStatus("Agent response received.");
                 } catch (cause) {
                   error(cause.message);
                 } finally {
                   setBusy(false);
                 }
               });
               document.getElementById("open-agent-studio").addEventListener("click", async () => {
                 try {
                   await request("/api/tier-action", {
                     method: "POST",
                     body: JSON.stringify({ tierId: "agent", root: result.worktreePath, includeAzure: true })
                   });
                 } catch (cause) {
                   error(cause.message);
                 }
               });
             } else if (!agentReady) {
               buttons.replace(componentActions, "");
             }
             const readiness = await request("/api/local-readiness?root=" + encodeURIComponent(result.worktreePath));
             document.getElementById("local-guidance").innerHTML = readiness.ready ? "" :
              '<p><strong>Local setup needed:</strong> ' + escape(readiness.guidance) + '</p>';
             const manageGateway = document.getElementById("configure-gateway");
             if (manageGateway) manageGateway.onclick = async () => {
              setBusy(true, "Opening AI Gateway Studio\u2026");
              try {
                await request("/api/tier-action", {
                  method: "POST",
                  body: JSON.stringify({ tierId: "gateway", root: result.worktreePath, includeAzure: true })
                });
               clearStatus("AI Gateway Studio opened for gateway and model selection.");
              } catch (cause) {
                error(cause.message);
              } finally {
                setBusy(false, status.textContent);
              }
             };
            const localAction = document.getElementById("local-action");
            localAction.dataset.appCommand = running ? "stop-local" : "run-local";
            buttons.update(localAction, {
              children: stopping ? "Stopping local app\u2026" : (running ? "Stop local app" : "Run locally"),
              disabled: stopping,
            });
          } catch (cause) {
            error(cause.message);
          }
         }
          function renderLocalFormattedOutput(terminal, text) {
            if (!terminal) return;
            while (terminal.firstChild) terminal.firstChild.remove();
            const lines = String(text || "").split("\\n");
            let previousPhase = "";
            let afterHttpTurn = false;
            let turnIndex = 0;
            lines.forEach((line, index) => {
              const row = document.createElement("span");
              const isError = /\\bstatus=(?:4\\d\\d|5\\d\\d)\\b|\\bHTTP(?:\\/\\d(?:\\.\\d)?)?\\s+(?:4\\d\\d|5\\d\\d)\\b|\\bverdict=rejected\\b|\\bdenied=[1-9]\\d*\\b|\\b(?:ERROR|CRITICAL|FATAL)\\b|\\bTraceback\\b|\\bfailed\\b|\u274C/i.test(line);
              const tagMatch = line.match(/^\\[([a-z0-9-]+)\\]/i);
              const tag = tagMatch ? tagMatch[1].toLowerCase() : "";
              const phase = ["startup", "shutdown", "gateway-setup", "provision", "deploy"].includes(tag)
                ? "lifecycle:" + tag
                : tag ? "runtime" : previousPhase;
              const isNewSandboxTurn = /^\\[sandbox\\]\\s+Creating ephemeral microVM/i.test(line);
              const isPostTurnStart = afterHttpTurn && tag !== "http";
              const isPhaseSwitch = Boolean(previousPhase && phase && previousPhase !== phase);
              const isTurnStart = index > 0 && (isNewSandboxTurn || isPostTurnStart || isPhaseSwitch);
              if (isNewSandboxTurn || isPostTurnStart || (index === 0 && phase === "runtime")) {
                turnIndex += 1;
              }
              row.className = "command-output-line"
                + (isError ? " is-error" : "")
                + (isTurnStart ? " is-turn-start" : "");
              if (isTurnStart && (isNewSandboxTurn || isPostTurnStart)) {
                row.dataset.turnLabel = "Turn " + turnIndex;
              }
              const tokenRegex = /(\\bstatus=(?:4\\d\\d|5\\d\\d)\\b|\\bHTTP(?:\\/\\d(?:\\.\\d)?)?\\s+(?:4\\d\\d|5\\d\\d)\\b|\\bverdict=rejected\\b|\\bdenied=[1-9]\\d*\\b|\\breason=[a-z0-9_-]+\\b|\\b(?:ERROR|CRITICAL|FATAL|Traceback)\\b)/gi;
              let lastIndex = 0;
              let match;
              while ((match = tokenRegex.exec(line)) !== null) {
                const token = match[0];
                if (!isError && /^reason=/i.test(token)) continue;
                if (match.index > lastIndex) {
                  row.append(document.createTextNode(line.slice(lastIndex, match.index)));
                }
                const badge = document.createElement("span");
                badge.className = "command-output-error-token";
                badge.textContent = token;
                row.append(badge);
                lastIndex = match.index + token.length;
              }
              if (lastIndex < line.length) {
                row.append(document.createTextNode(line.slice(lastIndex)));
              }
              if (index < lines.length - 1) {
                row.append(document.createTextNode("\\n"));
              }
              terminal.append(row);
              afterHttpTurn = /^\\[http\\]\\s+POST\\s+\\/(?:invoke|test-document|responses)\\b/i.test(line);
              if (phase) previousPhase = phase;
            });
          }
          document.getElementById("clear-local-output")?.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            try {
              await request("/api/app-output/clear", {
                method: "POST",
                body: JSON.stringify({ root: result.worktreePath }),
              });
              const terminal = document.getElementById("local-output");
              renderLocalFormattedOutput(terminal, "Command output cleared. Waiting for local app output.");
              if (terminal) terminal.scrollTop = terminal.scrollHeight;
            } catch (cause) {
              error(cause.message);
            }
          });
          async function refreshLocalOutput() {
            try {
              const output = await request("/api/app-output?root=" + encodeURIComponent(result.worktreePath));
              const terminal = document.getElementById("local-output");
              const text = output.lines.join("\\n") || "Waiting for local app output.";
              if (terminal && terminal.textContent !== text) {
                renderLocalFormattedOutput(terminal, text);
                terminal.scrollTop = terminal.scrollHeight;
              }
            } catch (cause) {
              error(cause.message);
            }
          }
          async function loadGatewayOptions() {
            try {
              const gatewayOptions = await request("/api/gateway-options?root=" + encodeURIComponent(result.worktreePath));
              const gatewaySummary = document.getElementById("gateway-summary");
              if (gatewaySummary) {
                gatewaySummary.textContent = gatewayOptions.active
                  ? "Active: " + gatewayOptions.active.name
                  : "No active gateway";
              }
              async function configureActiveGateway() {
                setBusy(true, "Configuring app from active gateway\u2026");
                try {
                  await request("/api/app-command", {
                    method: "POST",
                    body: JSON.stringify({ operation: "configure-gateway", root: result.worktreePath })
                  });
                  clearStatus("Gateway selected. Configuring app settings in the embedded terminal\u2026");
                } catch (cause) {
                  error("Gateway configuration failed: " + cause.message);
                } finally {
                  setBusy(false);
                }
              }
              buttons.replace(document.getElementById("gateway-binding"),
                '<label class="field">Active AI Gateway<select id="active-gateway">' +
                '<option value="">Choose a gateway</option>' +
                gatewayOptions.gateways.map((gateway) =>
                  '<option value="' + escape(gateway.name) + '"' +
                  (gatewayOptions.active?.name === gateway.name ? " selected" : "") + '>' +
                  escape(gateway.name + (gateway.resourceGroup ? " \xB7 " + gateway.resourceGroup : "")) +
                  '</option>').join("") + '</select></label>');
             if (gatewayOptions.active) {
                  const configure = buttons.create({ children: "Configure app from active gateway", "data-app-command": "configure-active-gateway" });
                  document.getElementById("gateway-binding").append(buttons.host(configure));
                 document.querySelector('[data-app-command="configure-active-gateway"]').addEventListener("click", async () => {
                   await configureActiveGateway();
                 });
                 const readiness = await request("/api/local-readiness?root=" + encodeURIComponent(result.worktreePath));
                 if (!readiness.ready) {
                   await configureActiveGateway();
                 }
             }
              document.getElementById("active-gateway")?.addEventListener("change", async (event) => {
                if (!event.target.value) return;
                try {
                  await request("/api/active-gateway", {
                    method: "POST",
                    body: JSON.stringify({ root: result.worktreePath, name: event.target.value })
                  });
                  await loadGatewayOptions();
                } catch (cause) {
                  error(cause.message);
                }
              });
            } catch (cause) {
              const gatewaySummary = document.getElementById("gateway-summary");
              if (gatewaySummary) gatewaySummary.textContent = "Discovery unavailable";
              buttons.replace(document.getElementById("gateway-binding"),
                '<p>AI Gateway discovery unavailable: ' + escape(cause.message) + '</p>');
            }
          }
        document.querySelectorAll("[data-app-command]").forEach((button) => button.addEventListener("click", async () => {
          setBusy(true, "Starting " + button.textContent + "\u2026");
          const commandPanel = document.getElementById("local-command-panel");
          if (commandPanel) commandPanel.open = true;
          try {
            if (button.dataset.appCommand === "configure-active-gateway") {
              const commandResult = await request("/api/app-command", {
                method: "POST",
                body: JSON.stringify({ operation: "configure-gateway", root: result.worktreePath })
              });
              clearStatus(commandResult.command + " started (PID " + commandResult.pid + ").");
              return;
            }
            if (button.dataset.appCommand === "run-local") {
              const readiness = await request("/api/local-readiness?root=" + encodeURIComponent(result.worktreePath));
              if (!readiness.ready) {
                await request("/api/tier-action", {
                  method: "POST",
                  body: JSON.stringify({ tierId: "gateway", root: result.worktreePath, includeAzure: true })
                });
                clearStatus("Local startup needs a gateway and model. AI Gateway Studio opened for setup.");
                return;
              }
            }
            const commandResult = await request("/api/app-command", {
              method: "POST",
              body: JSON.stringify({ operation: button.dataset.appCommand, root: result.worktreePath })
            });
            clearStatus(commandResult.outcome === "already-running"
              ? "The local app is already running."
              : commandResult.outcome === "operation-in-progress"
                ? "The local app is already " + commandResult.state + "."
                : commandResult.command + " started (PID " + commandResult.pid + ").");
            await refreshLocalStatus();
          } catch (cause) {
            error(cause.message);
          } finally {
            setBusy(false, status.textContent);
          }
        }));
        void refreshLocalStatus();
        void refreshLocalOutput();
        void loadGatewayOptions();
        outputTimer = setInterval(() => {
          void refreshLocalStatus();
          void refreshLocalOutput();
        }, 1000);
        document.querySelectorAll("[data-tier-action]").forEach((button) => button.addEventListener("click", async () => {
          setBusy(true, "Opening the tier studio\u2026");
          try {
            const action = await request("/api/tier-action", {
              method: "POST",
              body: JSON.stringify({ tierId: button.dataset.tierAction, root: result.worktreePath, includeAzure: true })
            });
            if (action.outcome === "candidates-discovered") {
              clearStatus("Tier evidence is ready in the response.");
            } else {
              clearStatus("No implementation found; scaffold guidance is ready.");
            }
          } catch (cause) {
            error(cause.message);
          } finally {
            setBusy(false, status.textContent);
          }
        }));
        async function traceAndRender(showProgress = true) {
          if (showProgress) setBusy(true, "Tracing source call graph\u2026");
          const traceButton = document.getElementById("trace-app");
          if (traceButton) buttons.setDisabled(traceButton, true);
          try {
            const traced = await request("/api/app-map", {
              method: "POST",
              body: JSON.stringify({ root: result.worktreePath })
            });
            renderInventory(result, inventory, traced);
          } catch (cause) {
            error(cause.message);
            if (traceButton) {
              buttons.update(traceButton, { disabled: false, children: "Retry map" });
            }
          } finally {
            if (showProgress) setBusy(false, status.textContent);
          }
        }
        document.getElementById("trace-app").addEventListener("click", () => void traceAndRender());
        document.getElementById("open-app-map")?.addEventListener("click", async () => {
          setBusy(true, "Opening expanded App Map\u2026");
          try {
            await request("/api/open-app-map", {
              method: "POST",
              body: JSON.stringify({ root: result.worktreePath })
            });
            clearStatus("Expanded App Map opened.");
          } catch (cause) {
            error(cause.message);
          } finally {
            setBusy(false, status.textContent);
          }
        });
        if (!appMap) void traceAndRender(false);
        document.getElementById("delete-app").addEventListener("click", async () => {
          await deleteApp(result.worktreePath, draft.appName);
        });
      }

      async function submit() {
        if (unknownCreationName === draft.appName) { await beginOpenApp(); return; }
        window.__appPlatformSubmitting = true;
        const openEditor = document.getElementById("open-editor");
        if (openEditor) {
          draft.openInEditor = openEditor.checked;
        }
        const sourceBindings = draft.journey === "assemble"
          ? draft.tierIds.map((tierId) => ({
              tierId,
              sourceIds: [draft.sourceBindings[tierId]],
              azureResourceIds: draft.azureBindings[tierId] ? [draft.azureBindings[tierId]] : []
            }))
          : [];
        const readCreation = (${readWorkspaceCreation.toString()});
        let creationStage = draft.journey === "assemble" ? "Starting assembly..." : "Preparing app creation...";
        let openingWorkspace = false;
        const progress = message => {
          creationStage = message;
          status.textContent = "";
          const label = document.getElementById("creation-stage");
          if (label) label.textContent = message;
        };
        setBusy(true, creationStage);
        app.setAttribute("aria-busy", "true");
        const creationProgress = document.createElement("div");
        creationProgress.className = "journey-progress creation-progress";
        creationProgress.setAttribute("role", "status");
        creationProgress.innerHTML = '<span class="journey-spinner" aria-hidden="true"></span><span id="creation-stage"></span>';
        app.before(creationProgress);
        progress(creationStage);
        const waitingTimer = setTimeout(() => progress(creationStage + " This is taking longer than expected. Do not submit another creation request."), 15000);
        try {
          const response = await fetch("/api/workspace-request", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-App-Platform-Token": apiToken, "Accept": "application/x-ndjson" },
            body: JSON.stringify({
              journey: draft.journey,
              starterKind: draft.journey === "assemble" ? "assembly" : draft.starterKind,
              appName: draft.appName,
              purpose: draft.purpose,
              tierIds: draft.tierIds,
              templateRootId: draft.templateRootId || undefined,
              templateInputs: draft.templateInputs,
              sourceBindings,
              openInEditor: draft.openInEditor,
              editorId: editorSettings.editorId
            })
          });
          const result = await readCreation(response, progress);
          if (result.worktreePath) {
            openingWorkspace = true;
            progress("App created. Opening workspace...");
            openAppMap(result.worktreePath, result.editorWarning, "build");
          } else {
            window.__appPlatformSubmitting = false;
            renderLanding();
            clearStatus("Assembly started. The app will appear here when its isolated workspace is ready.");
            setBusy(false, status.textContent);
          }
        } catch (cause) {
          window.__appPlatformSubmitting = false;
          if (cause.creationOutcomeUnknown || cause instanceof TypeError) {
            unknownCreationName = draft.appName;
            error("Creation outcome is unknown. Check existing apps before submitting another request. " + cause.message);
            buttons.update(document.getElementById("next"), { children: "Check existing apps" });
          } else error(cause.message);
          setBusy(false, status.textContent);
        } finally {
          clearTimeout(waitingTimer);
          if (!openingWorkspace) { creationProgress.remove(); app.removeAttribute("aria-busy"); }
        }
      }

      renderLanding();
      const launchParams = new URLSearchParams(location.search);
      const launchNotice = launchParams.get("notice");
      void loadSources().then(() => {
        if (draft.journey === null && launchNotice) {
          if (launchParams.get("noticeKind") === "error") error(launchNotice);
          else clearStatus(launchNotice);
        }
      }).catch(cause => {
        if (draft.journey === null) error(launchNotice ? launchNotice + " Apps could not be refreshed: " + cause.message : cause.message);
      }).finally(() => {
        if (draft.journey === "new" && draft.step === 1) renderDetails();
      });
      ${intro?renderStudioIntroClientScript():""}
      ${renderThemeClientScript(apiToken,editorSettings)}
      window.appPlatformReady = true;
      window.dispatchEvent(new Event("app-platform-ready"));
      })().catch(cause => {
        document.getElementById("canvas-controls-loading")?.remove();
        const status = document.getElementById("status");
        status.className = "error";
        status.textContent = "Could not load Canvas controls: " + cause.message + ". Reload to retry.";
      });
    </script>
  </body>
</html>`}export{renderAppMapMarkup,renderInteractiveAppMapHtml as renderExpandedAppMapHtml,renderStudioHtml};

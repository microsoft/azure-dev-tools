import { createRequire as __canvasCreateRequire } from "node:module";
const require = __canvasCreateRequire(import.meta.url);
var __defProp=Object.defineProperty;var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})};import{createCanvas,joinSession}from"@github/copilot-sdk/extension";import os2 from"node:os";import path2 from"node:path";import fs from"node:fs/promises";import{spawn as spawn3}from"node:child_process";import http from"node:http";import{randomBytes}from"node:crypto";var HOST_SESSION_VARIABLE=/^(?:SESSION_ID|(?:COPILOT|AGENCY)_\w*SESSION\w*)$/i;function inheritedCliEnvironment(source=process.env){let env={};for(let[key,value]of Object.entries(source))typeof value=="string"&&!HOST_SESSION_VARIABLE.test(key)&&(env[key]=value);return env}function scrubHostSessionEnv(target=process.env){let removed=[];for(let key of Object.keys(target))target===process.env&&key.toUpperCase()==="SESSION_ID"||HOST_SESSION_VARIABLE.test(key)&&(delete target[key],removed.push(key));return removed}function humanErrorSummary(message,needsAuth=!1,status=""){let text=String(message||"");return/ContainerAlreadyExists|QueueAlreadyExists|TableAlreadyExists|ShareAlreadyExists|ResourceAlreadyExists|already exists/i.test(text)?"That resource already exists. Choose a different name.":/IncorrectConfiguration|AADSTS901001|invalid.*client_session/i.test(text)?"Azure CLI authentication is misconfigured. Check the tenant login in Azure CLI, then retry.":needsAuth||/AADSTS500|please run.*az login|interaction_required|expired.*token/i.test(text)?"Azure access needs sign-in. Use Sign in only if you want to authenticate, then retry.":String(status)==="403"||/HTTP 403|AuthorizationFailed|Forbidden|PermissionMismatch|not authorized/i.test(text)?"Azure denied access. Check your resource permissions, then retry.":String(status)==="429"||/HTTP 429|TooManyRequests/i.test(text)?"Azure is throttling requests. Wait briefly, then retry.":/ETIMEDOUT|ENOTFOUND|ECONNRESET|fetch failed|timed? ?out/i.test(text)?"Azure could not be reached. Check your network connection, then retry.":text.length>240||/[\r\n]|Command failed|cmd\.exe|Traceback|az account get-access-token|ARM (GET|POST)|HTTP \d{3}/i.test(text)?"Azure could not complete the request. Retry, or open the Debug log for diagnostics.":text}function classifyAuthError(message="",code=""){let text=`${message} ${code}`,aadCode=/\bAADSTS(\d{5,7})\b/.exec(text)?.[1]||null;return aadCode==="901001"||/invalid[_ ]request|client_session/i.test(text)?{needsAuth:!1,kind:"invalid-request",aadCode}:/\b403\b|AuthorizationFailed|\bForbidden\b|does not have authorization/i.test(text)?{needsAuth:!1,kind:"permission",aadCode}:/\b429\b|TooManyRequests|throttl/i.test(text)?{needsAuth:!1,kind:"throttled",aadCode}:/\b401\b|CredentialUnavailable|DefaultAzureCredential|az login|not (?:logged|signed) in|AADSTS(?:50076|50079|50078|50158|65001|700082|70043|50173)|\bcredential\b/i.test(text)?{needsAuth:!0,kind:"needs-auth",aadCode}:aadCode||/authenticat/i.test(text)?{needsAuth:!0,kind:"needs-auth",aadCode}:{needsAuth:!1,kind:"other",aadCode}}function cspHeader(nonce){return["default-src 'none'",`script-src 'nonce-${nonce}'`,"style-src 'unsafe-inline'","img-src 'self' data:","connect-src 'self'","font-src 'self'","base-uri 'none'","form-action 'none'","frame-ancestors 'none'"].join("; ")}var MAX_BODY=100*1024*1024;function isLoopbackHost(hostHeader){if(!hostHeader)return!1;let h=String(hostHeader).toLowerCase(),host=h.startsWith("[")?h.slice(0,h.indexOf("]")+1):h.split(":")[0];return host==="127.0.0.1"||host==="localhost"||host==="[::1]"||host==="::1"}function sameOriginLoopback(req){if(!isLoopbackHost(req.headers.host))return!1;let origin=req.headers.origin;if(origin)try{if(!isLoopbackHost(new URL(origin).host))return!1}catch{return!1}return!0}function createCanvasServer({html,routes={},media=null,initialState={},port=0}={}){let state={activityLog:[],s_entitiesRevision:0,...initialState},clients=new Set;function broadcast(entitiesChanged){let update={...state};entitiesChanged||(delete update.s_entities,update.s_entitiesUnchanged=!0);let data=`data: ${JSON.stringify(update)}

`;for(let res of clients)try{res.write(data)}catch{}}function setState(patch){let entitiesChanged=Object.hasOwn(patch,"s_entities");state={...state,...patch,s_entitiesRevision:(state.s_entitiesRevision||0)+Number(entitiesChanged)},broadcast(entitiesChanged)}function getState(){return state}function log(msg){let line=`[${new Date().toLocaleTimeString()}] ${msg}`,activityLog=[...state.activityLog||[],line].slice(-200);setState({activityLog})}let ctx={getState,setState,log},server2=http.createServer(async(req,res)=>{if(req.method==="GET"&&req.url==="/events"){res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive"}),res.write(`data: ${JSON.stringify(state)}

`),clients.add(res),req.on("close",()=>clients.delete(res));return}if(req.method==="GET"&&(req.url==="/"||req.url.startsWith("/?"))){let nonce=randomBytes(16).toString("base64");res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":cspHeader(nonce),"X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"}),res.end(typeof html=="function"?html(nonce):String(html||""));return}if(req.method==="GET"&&media&&req.url!=="/"&&!req.url.startsWith("/?")){let u=new URL(req.url,"http://127.0.0.1"),out=null;try{out=await media(u.pathname,u.searchParams,ctx)}catch(err){res.writeHead(500,{"Content-Type":"text/plain"}),res.end(String(err?.message||err));return}if(out&&out.buffer){res.writeHead(200,{"Content-Type":out.contentType||"application/octet-stream","Cache-Control":"no-store"}),res.end(out.buffer);return}}if(req.method==="POST"){if(!sameOriginLoopback(req)){res.writeHead(403,{"Content-Type":"application/json"}),res.end(JSON.stringify({ok:!1,error:"cross-origin request blocked"}));return}let path3=req.url.split("?")[0],handler=routes[path3];if(!handler){res.writeHead(404,{"Content-Type":"application/json"}),res.end(JSON.stringify({ok:!1,error:"no route "+path3}));return}let body="",tooLarge=!1;req.on("data",c=>{tooLarge||(body+=c,body.length>MAX_BODY&&(tooLarge=!0,res.writeHead(413,{"Content-Type":"application/json"}),res.end(JSON.stringify({ok:!1,error:"request body too large"})),req.destroy()))}),req.on("end",async()=>{if(tooLarge)return;let payload;try{payload=body?JSON.parse(body):{}}catch{res.writeHead(400,{"Content-Type":"application/json"}),res.end(JSON.stringify({ok:!1,error:"malformed JSON body"}));return}try{let source=req.headers["x-storage-invocation-source"]==="model"?"model":"panel",out=await handler(payload,ctx,source);res.writeHead(200,{"Content-Type":"application/json"}),res.end(JSON.stringify(out??{ok:!0}))}catch(err){res.writeHead(500,{"Content-Type":"application/json"}),res.end(JSON.stringify({ok:!1,error:String(err?.message||err)}))}});return}res.writeHead(404),res.end()});return new Promise(resolve=>{server2.listen(port,"127.0.0.1",()=>{let port2=server2.address().port;resolve({port:port2,url:`http://127.0.0.1:${port2}`,getState,setState,log,close:()=>{for(let res of clients)try{res.end()}catch{}clients.clear(),server2.close()}})})})}async function safe(fn){try{return{ok:!0,data:await fn()}}catch(err){let msg=String(err?.message||err),code=String(err?.code||err?.statusCode||""),{needsAuth,kind}=classifyAuthError(msg,code);return{ok:!1,error:msg,needsAuth,authKind:kind}}}var azure_exports={};__export(azure_exports,{accountMeta:()=>accountMeta,blobSize:()=>blobSize,clearQueueMessages:()=>clearQueueMessages,collectBlobs:()=>collectBlobs,createContainer:()=>createContainer,createQueue:()=>createQueue,createShare:()=>createShare,createShareDirectory:()=>createShareDirectory,createTable:()=>createTable,credential:()=>credential,deleteBlob:()=>deleteBlob,deleteContainer:()=>deleteContainer,deleteEntity:()=>deleteEntity,deleteQueue:()=>deleteQueue,deleteQueueMessage:()=>deleteQueueMessage,deleteShare:()=>deleteShare,deleteShareItem:()=>deleteShareItem,deleteTable:()=>deleteTable,discoveryFailure:()=>discoveryFailure,downloadBlob:()=>downloadBlob,downloadSasBlob:()=>downloadSasBlob,downloadShareFile:()=>downloadShareFile,ensureAccountMeta:()=>ensureAccountMeta,generateBlobSas:()=>generateBlobSas,generateContainerSas:()=>generateContainerSas,getAccountConfig:()=>getAccountConfig,listBlobDirectory:()=>listBlobDirectory,listBlobs:()=>listBlobs,listContainers:()=>listContainers,listQueues:()=>listQueues,listSasBlobs:()=>listSasBlobs,listShareItems:()=>listShareItems,listShares:()=>listShares,listStorageAccounts:()=>listStorageAccounts,listStorageAccountsForSubs:()=>listStorageAccountsForSubs,listStoragePage:()=>listStoragePage,listSubscriptions:()=>listSubscriptions,listTables:()=>listTables,listTenantSubscriptions:()=>listTenantSubscriptions,listTenants:()=>listTenants,openInStorageExplorer:()=>openInStorageExplorer,peekQueueMessages:()=>peekQueueMessages,queryTableEntities:()=>queryTableEntities,registerAccountContext:()=>registerAccountContext,requireNewResource:()=>requireNewResource,resetTokenCache:()=>resetTokenCache,resolveBlobService:()=>resolveBlobService,resolveQueueService:()=>resolveQueueService,resolveShareService:()=>resolveShareService,resolveTableService:()=>resolveTableService,sendQueueMessage:()=>sendQueueMessage,setBlobTier:()=>setBlobTier,signIn:()=>signIn,storageCredential:()=>storageCredential,storageExplorerDeepLink:()=>storageExplorerDeepLink,storageExplorerInstalled:()=>storageExplorerInstalled,storagePage:()=>storagePage,tokenFor:()=>tokenFor,updateQueueMessage:()=>updateQueueMessage,uploadBlob:()=>uploadBlob,uploadShareFile:()=>uploadShareFile,upsertEntity:()=>upsertEntity,warmup:()=>warmup});import{execFile,spawn,spawnSync}from"node:child_process";import{createHash}from"node:crypto";import{accessSync,constants,readFileSync}from"node:fs";import{cp,lstat,mkdir,mkdtemp,readFile,readdir,rename,rm,stat,writeFile}from"node:fs/promises";import os from"node:os";import path from"node:path";import{fileURLToPath}from"node:url";function resolveStudioRoot(moduleUrl){let directory=path.dirname(fileURLToPath(moduleUrl)),candidates=path.basename(directory)==="src"?[directory,path.dirname(directory)]:[directory];for(let candidate of candidates)for(let metadata of["studio-package.json","package.json"])try{return accessSync(path.join(candidate,metadata)),candidate}catch(error){if(error.code!=="ENOENT")throw error}throw new Error(`Missing canvas package metadata for ${moduleUrl}`)}function resolveStudioBuildInfo(moduleUrl,fallbackVersion="unknown"){let version=fallbackVersion,revision="unknown";try{let manifest;try{manifest=readFileSync(new URL("./studio-package.json",moduleUrl),"utf8")}catch(error){if(error.code!=="ENOENT")throw error;manifest=readFileSync(path.join(resolveStudioRoot(moduleUrl),"package.json"),"utf8")}version=JSON.parse(manifest).version||fallbackVersion}catch{}try{revision=createHash("sha256").update(readFileSync(new URL(moduleUrl))).digest("hex").slice(0,10)}catch{}return{version,revision}}var ICONS={vscode:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>',github:'<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',azure:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.05 2 4 20.01h5.86l1.45-3.73 5.63 5.72H24L13.05 2Zm.8 6.42 4.37 10.36-5.25-4.79 2.91-5.01-2.03-.56ZM10.1 17.73H6.78l5.45-10.85 1.43 3.38-3.56 7.47Z"/></svg>'},COMMAND_BUTTONS=`<button class="btn ghost" id="open-vscode">${ICONS.vscode}<span class="label">Open in VS Code</span></button>
      <button class="btn ghost" id="save-github">${ICONS.github}<span class="label">Save to GitHub</span></button>
      <button class="btn ghost" id="deploy-azure">${ICONS.azure}<span class="label">Deploy to Azure</span></button>`;function canExecuteCommand(file,osName=os.platform()){try{return accessSync(file,osName==="win32"?constants.F_OK:constants.X_OK),!0}catch{return!1}}var WINDOWS_COMMAND_META_CHARACTERS=/([()\][%!^"`<>&|;, *?])/g;function escapeWindowsCommandMetaCharacters(value){return value.replace(WINDOWS_COMMAND_META_CHARACTERS,"^$1")}function assertWindowsCommandValue(value){let text=String(value);if(/[\r\n]/.test(text))throw new Error("Command arguments contain unsupported Windows command characters.");return text}function escapeWindowsCommand(value){return escapeWindowsCommandMetaCharacters(assertWindowsCommandValue(value))}function quoteWindowsCommandArgument(value){let text=assertWindowsCommandValue(value);return text=text.replace(/(?=(\\+?)?)\1"/g,'$1$1\\"'),text=text.replace(/(?=(\\+?)?)\1$/,"$1$1"),escapeWindowsCommandMetaCharacters(`"${text}"`)}function windowsCommandShellLine(command,args=[]){return`"${[escapeWindowsCommand(command),...args.map(quoteWindowsCommandArgument)].join(" ")}"`}function spawnSpecForLocated(located,args,env,osName){return osName==="win32"&&/\.(?:cmd|bat)$/i.test(located.path)?{file:env.ComSpec||env.COMSPEC||path.win32.join(env.SystemRoot||env.SYSTEMROOT||"C:\\Windows","System32","cmd.exe"),args:["/d","/s","/c",windowsCommandShellLine(located.path,args)],env,located,windowsVerbatimArguments:!0}:{file:located.path,args:[...args],env,located,windowsVerbatimArguments:!1}}var AZURE_CLI_ENV_KEYS=["HOME","USER","LOGNAME","TMPDIR","LANG","LC_ALL","SHELL","USERPROFILE","HOMEDRIVE","HOMEPATH","SystemRoot","SYSTEMROOT","TEMP","TMP","ComSpec","COMSPEC","PATHEXT","AZURE_CONFIG_DIR","XDG_CONFIG_HOME","HTTP_PROXY","HTTPS_PROXY","ALL_PROXY","NO_PROXY","http_proxy","https_proxy","all_proxy","no_proxy","REQUESTS_CA_BUNDLE","CURL_CA_BUNDLE","SSL_CERT_FILE","SSL_CERT_DIR","AZURE_CLI_DISABLE_CONNECTION_VERIFICATION"];function sourcePath(source){return source.PATH||source.Path||source.path||""}function locateAzureCli(source=process.env,osName=os.platform(),exists=candidate=>canExecuteCommand(candidate,osName)){let paths=osName==="win32"?path.win32:path.posix,inherited=sourcePath(source).split(paths.delimiter).filter(Boolean),home=source.HOME||source.USERPROFILE||os.homedir(),known=osName==="win32"?[paths.join(source.ProgramFiles||"C:\\Program Files","Microsoft SDKs","Azure","CLI2","wbin"),paths.join(source["ProgramFiles(x86)"]||"C:\\Program Files (x86)","Microsoft SDKs","Azure","CLI2","wbin")]:["/opt/homebrew/bin","/usr/local/bin","/opt/local/bin",paths.join(home,".local","bin"),paths.join(home,"bin"),"/usr/bin","/bin","/snap/bin"],directories=[...new Set([...inherited,...known])],searched=[];if(source.AZURE_CLI_PATH&&(searched.push(source.AZURE_CLI_PATH),exists(source.AZURE_CLI_PATH)))return{found:!0,path:source.AZURE_CLI_PATH,directory:paths.dirname(source.AZURE_CLI_PATH),searched};for(let directory of directories)for(let name of osName==="win32"?["az.cmd","az.exe","az"]:["az"]){let candidate=paths.join(directory,name);if(searched.push(candidate),exists(candidate))return{found:!0,path:candidate,directory,searched}}return{found:!1,path:"",directory:"",searched}}var AzureCliNotFoundError=class extends Error{constructor(searched=[]){super("Azure CLI executable was not found. Install Azure CLI or set AZURE_CLI_PATH to its absolute path, then retry."),this.name="AzureCliNotFoundError",this.code="AZURE_CLI_NOT_FOUND",this.searched=searched}};function azureCliChildEnv(source=process.env,located=locateAzureCli(source),osName=os.platform()){let paths=osName==="win32"?path.win32:path.posix,env={},copied=new Set;for(let key of AZURE_CLI_ENV_KEYS){let identity=osName==="win32"?key.toLowerCase():key;source[key]!=null&&!copied.has(identity)&&(env[key]=source[key],copied.add(identity))}let inherited=sourcePath(source).split(paths.delimiter).filter(Boolean),fallbacks=osName==="win32"?[paths.join(source.SystemRoot||source.SYSTEMROOT||"C:\\Windows","System32"),source.SystemRoot||source.SYSTEMROOT||"C:\\Windows"]:["/opt/homebrew/bin","/usr/local/bin","/usr/bin","/bin"];return env.PATH=[...new Set([...located.found?[located.directory]:[],...inherited,...fallbacks])].join(paths.delimiter),osName==="win32"&&!env.ComSpec&&!env.COMSPEC&&(env.ComSpec=paths.join(source.SystemRoot||source.SYSTEMROOT||"C:\\Windows","System32","cmd.exe")),env}function azureCliSpawnSpec(args,{env=process.env,osName=os.platform(),locate=locateAzureCli}={}){assertFixtureAuthenticationDenied("az");let located=locate(env,osName);if(!located.found)throw new AzureCliNotFoundError(located.searched);let childEnv=azureCliChildEnv(env,located,osName);return spawnSpecForLocated(located,args,childEnv,osName)}async function runAzureCliJson(args,subscription,{timeout=3e4,maxBuffer=1024*1024,env=process.env,execute=execFileText,locate=locateAzureCli,osName=os.platform(),signal}={}){let full=subscription?[...args,"--subscription",subscription]:[...args],withFlag=full.includes("--only-show-errors")?full:[...full,"--only-show-errors"],{stdout}=await runAzureCliText(withFlag,{env,maxBuffer,timeout,execute,locate,osName,...signal?{signal}:{}}),text=stdout.trim();return text?JSON.parse(text):null}async function runAzureCliText(args,{env=process.env,execute=execFileText,locate=locateAzureCli,osName=os.platform(),...options}={}){let command=azureCliSpawnSpec(args,{env,locate,osName});return execute(command.file,command.args,{maxBuffer:1024*1024,...options,env:command.env,windowsVerbatimArguments:command.windowsVerbatimArguments})}var fixtureAuthCommands=[];function assertFixtureAuthenticationDenied(command,args=[]){if(process.env.FUNCTION_STUDIO_TEST_MODE!=="1")return;let name=path.win32.basename(String(command)).replace(/\.(?:cmd|bat|exe)$/i,"").toLowerCase(),gitRemote=name==="git"&&args.some(arg=>["clone","fetch","pull","push","ls-remote","credential"].includes(arg)),packageInstall=["npm","npx","pip","pip3","uv"].includes(name)&&args.some(arg=>["install","exec","add","run"].includes(arg))||/^python(?:\d+(?:\.\d+)?)?$/.test(name)&&args.includes("pip")&&args.includes("install");if(!(!gitRemote&&!packageInstall&&!["az","azd","gh","azureauth","security","codesign","npx"].includes(name)))throw fixtureAuthCommands.push(name),new Error(`Live authentication command '${name}' is disabled in Hosted Skills fixture mode. Inject a fake service instead.`)}function execFileText(file,args,options={}){return new Promise((resolve,reject)=>{assertFixtureAuthenticationDenied(file,args),execFile(file,args,{maxBuffer:1024*1024,...options},(error,stdout,stderr)=>{if(error){error.stdout=stdout,error.stderr=stderr,reject(error);return}resolve({stdout,stderr})})})}import{BlobServiceClient,StorageSharedKeyCredential,ContainerClient,generateBlobSASQueryParameters,BlobSASPermissions,ContainerSASPermissions,SASProtocol}from"./sdk/blob.mjs";import{QueueServiceClient,StorageSharedKeyCredential as QueueSharedKey}from"./sdk/queue.mjs";import{ShareServiceClient,StorageSharedKeyCredential as FileSharedKey}from"./sdk/file.mjs";import{TableServiceClient,TableClient,AzureNamedKeyCredential}from"./sdk/tables.mjs";import{spawn as spawn2,spawnSync as spawnSync2}from"node:child_process";import{existsSync}from"node:fs";var ARM="https://management.azure.com",API="2023-01-01";scrubHostSessionEnv();var _credentials=new Map;function credential(tenantId=""){return _credentials.has(tenantId)||_credentials.set(tenantId,{async getToken(scopes,options){if(options?.claims)throw new Error("Azure CLI cannot satisfy this claims challenge. Sign in to the account's tenant and retry.");let args=["account","get-access-token","--scope",...Array.isArray(scopes)?scopes:[scopes],"--output","json"];tenantId&&args.push("--tenant",tenantId);let result=await runAzureCliJson(args,void 0,{env:inheritedCliEnvironment()}),expiresOnTimestamp=result?.expires_on?Number(result.expires_on)*1e3:Date.parse(result?.expiresOn);if(!result?.accessToken||!Number.isFinite(expiresOnTimestamp))throw new Error("Azure CLI returned an invalid access token response. Run `az login` and retry.");return{token:result.accessToken,expiresOnTimestamp}}}),_credentials.get(tenantId)}var _tokens=new Map;async function tokenFor(scope,tenantId="",acquire=credential){let key=JSON.stringify([tenantId,scope]),now=Date.now(),hit=_tokens.get(key);if(hit?.token&&hit.exp-12e4>now)return hit.token;if(hit?.inflight)return hit.inflight;let inflight=acquire(tenantId).getToken(scope).then(t=>{if(!t?.token)throw new Error(`Could not acquire a token for ${scope}. Run \`az login\`.`);return _tokens.set(key,{token:t.token,exp:t.expiresOnTimestamp||now+33e5}),t.token}).catch(e=>{throw _tokens.delete(key),e});return _tokens.set(key,{...hit||{},inflight}),inflight}function storageCredential(account){if(!accountMeta(account)&&!knownAccount(account))throw new Error(`Storage account '${account}' has no known subscription or tenant context. Select its subscription before accessing storage.`);return{getToken:async(scopes,options)=>{let{tenantId}=await ensureAccountMeta(account);if(options?.claims)return credential(tenantId).getToken(scopes,options);let scope=Array.isArray(scopes)?scopes[0]:scopes;return{token:await tokenFor(scope,tenantId),expiresOnTimestamp:_tokens.get(JSON.stringify([tenantId,scope]))?.exp??Date.now()+33e5}}}}var _warmed=null;function warmup(){return _warmed||(_warmed=Promise.allSettled([tokenFor("https://management.azure.com/.default"),tokenFor("https://storage.azure.com/.default")]),_warmed)}function resetTokenCache(){_tokens.clear(),_credentials.clear(),svcCache.clear(),queueCache.clear(),tableCache.clear(),shareCache.clear(),_warmed=null}function azMissingMsg(e){let m=String(e&&e.message||e);return/ENOENT/i.test(m)?"Azure CLI (az) was not found on PATH. Install it from aka.ms/azure-cli, then try again, or run `az login` manually.":"Could not start az login: "+m}var _signInInflight=null;function signIn(opts={}){return _signInInflight||(_signInInflight=_doSignIn(opts).finally(()=>{_signInInflight=null}),_signInInflight)}function _doSignIn({tenantId,timeoutMs=18e4,_spawn=spawn2}={}){return new Promise(resolve=>{let isWin=process.platform==="win32",env={...inheritedCliEnvironment(),AZURE_CORE_LOGIN_EXPERIENCE_V2:"off"},child;try{child=_spawn("az",["login","--only-show-errors",...tenantId?["--tenant",tenantId]:[]],{env,windowsHide:!0,shell:isWin,stdio:["ignore","ignore","pipe"]})}catch(e){resolve({ok:!1,error:azMissingMsg(e)});return}let err="";child.stderr&&child.stderr.on("data",d=>{err+=String(d)});let timer=setTimeout(()=>{try{child.kill()}catch{}resolve({ok:!1,error:"Sign-in timed out after 3 minutes. Finish az login in the browser, then click Refresh."})},timeoutMs);child.on("error",e=>{clearTimeout(timer),resolve({ok:!1,error:azMissingMsg(e)})}),child.on("close",code=>{if(clearTimeout(timer),code===0){resetTokenCache(),resolve({ok:!0});return}resolve({ok:!1,error:err.trim()||"az login exited with code "+code})})})}var SE_RESOURCE_TYPE={blob:"Azure.BlobContainer",file:"Azure.FileShare",queue:"Azure.Queue",table:"Azure.Table"};function storageExplorerDeepLink({account,kind,item}={}){let m=account?accountMeta(account):null;if(!m||!m.subscriptionId||!m.resourceGroup)return null;let accountId=`/subscriptions/${m.subscriptionId}/resourceGroups/${m.resourceGroup}/providers/Microsoft.Storage/storageAccounts/${m.name}`,link="storageexplorer://v=1&accountid="+encodeURIComponent(accountId)+"&subscriptionid="+encodeURIComponent(m.subscriptionId),rt=kind?SE_RESOURCE_TYPE[kind]:null;return rt&&item&&(link+="&resourcetype="+encodeURIComponent(rt)+"&resourcename="+encodeURIComponent(item)),link}function storageExplorerExe(){if(process.platform!=="win32")return null;let candidates=[process.env.LOCALAPPDATA&&process.env.LOCALAPPDATA+"\\Programs\\Microsoft Azure Storage Explorer\\StorageExplorer.exe",process.env.ProgramFiles&&process.env.ProgramFiles+"\\Microsoft Azure Storage Explorer\\StorageExplorer.exe",process.env["ProgramFiles(x86)"]&&process.env["ProgramFiles(x86)"]+"\\Microsoft Azure Storage Explorer\\StorageExplorer.exe"].filter(Boolean);for(let p of candidates)try{if(existsSync(p))return p}catch{}return null}var SE_DOWNLOAD="https://aka.ms/storageexplorer",_seInstalled;function storageExplorerInstalled(){if(_seInstalled!==void 0)return _seInstalled;if(storageExplorerExe())return _seInstalled=!0;if(process.platform==="win32"){for(let key of["HKCU\\Software\\Classes\\storageexplorer","HKCR\\storageexplorer"])try{let r=spawnSync2("reg",["query",key],{stdio:"ignore",windowsHide:!0});if(r&&r.status===0)return _seInstalled=!0}catch{}return _seInstalled=!1}return _seInstalled=null}function openBrowser(url){let opts={detached:!0,stdio:"ignore"},file,args;process.platform==="win32"?(file=process.env.ComSpec||"cmd.exe",args=["/c","start","",url]):process.platform==="darwin"?(file="open",args=[url]):(file="xdg-open",args=[url]);try{let c=spawn2(file,args,opts);c.on("error",()=>{}),c.unref&&c.unref()}catch{}}function seMissingMsg(e){let m=String(e&&e.message||e);return/ENOENT/i.test(m)?"Azure Storage Explorer isn't installed. Get the free desktop app at "+SE_DOWNLOAD+".":"Could not launch Azure Storage Explorer: "+m}function openInStorageExplorer({account,kind,item}={}){return new Promise(resolve=>{if(storageExplorerInstalled()===!1){openBrowser(SE_DOWNLOAD),resolve({ok:!1,notInstalled:!0,install:SE_DOWNLOAD});return}let link=storageExplorerDeepLink({account,kind,item}),exe=storageExplorerExe(),opts={detached:!0,stdio:"ignore"},file,args;if(exe)file=exe,args=link?[link]:[];else if(process.platform==="win32"){if(!link){openBrowser(SE_DOWNLOAD),resolve({ok:!1,notInstalled:!0,install:SE_DOWNLOAD});return}file=process.env.ComSpec||"cmd.exe",args=["/c","start","",link]}else process.platform==="darwin"?(file="open",args=link?[link]:["-a","Microsoft Azure Storage Explorer"]):(file="StorageExplorer",args=link?[link]:[]);let onFail=e=>{if(e&&/ENOENT/i.test(String(e.message||e))){openBrowser(SE_DOWNLOAD),resolve({ok:!1,notInstalled:!0,install:SE_DOWNLOAD});return}resolve({ok:!1,error:seMissingMsg(e)})},child;try{child=spawn2(file,args,opts)}catch(e){onFail(e);return}child.on("error",onFail),child.on("spawn",()=>{try{child.unref()}catch{}resolve({ok:!0,deepLink:!!link})})})}async function armToken(tenantId){return tokenFor("https://management.azure.com/.default",tenantId)}async function armGet(path3,tenantId){let res=await fetch(`${ARM}${path3}`,{headers:{Authorization:`Bearer ${await armToken(tenantId)}`}});if(!res.ok){let e=new Error(`ARM GET ${path3} \u2192 HTTP ${res.status}`);throw e.statusCode=res.status,e}return res.json()}async function armPost(path3,tenantId){let res=await fetch(`${ARM}${path3}`,{method:"POST",headers:{Authorization:`Bearer ${await armToken(tenantId)}`}});if(!res.ok){let e=new Error(`ARM POST ${path3} \u2192 HTTP ${res.status}`);throw e.statusCode=res.status,e}return res.json()}async function armGetAll(path3,tenantId){let token=await armToken(tenantId),url=path3.startsWith("http")?path3:`${ARM}${path3}`,items=[];for(;url;){let res=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});if(!res.ok){let e=new Error(`ARM GET ${url} \u2192 HTTP ${res.status}`);throw e.statusCode=res.status,e}let j=await res.json();if(Array.isArray(j.value))for(let v of j.value)items.push(v);url=j.nextLink||j["@odata.nextLink"]||null}return items}async function listSubscriptions({runCli=runAzureCliJson}={}){let value=await runCli(["account","list","--all","--output","json"],void 0,{env:inheritedCliEnvironment()});if(!Array.isArray(value))throw new Error("Azure CLI returned an invalid subscription list.");if(value.some(s=>s.id&&!s.tenantId))throw new Error("Azure CLI returned a subscription without a tenant. Refresh your Azure CLI login.");return value.filter(s=>s.id).map(s=>({subscriptionId:s.id,displayName:s.name,tenantId:s.tenantId,state:s.state}))}async function listTenants({read=armGetAll}={}){return(await read("/tenants?api-version=2022-12-01")).map(t=>({tenantId:t.tenantId,displayName:t.displayName||t.defaultDomain||"Unnamed directory",defaultDomain:t.defaultDomain||"",current:!0}))}async function listTenantSubscriptions(tenantId,{read=armGetAll}={}){if(!tenantId)throw new Error("A tenant is required.");return(await read("/subscriptions?api-version=2022-12-01",tenantId)).map(s=>({subscriptionId:s.subscriptionId,displayName:s.displayName,tenantId,state:s.state}))}function discoveryFailure(error){let text=String(error?.message||error),auth=classifyAuthError(text),status=error?.statusCode||/\bHTTP (\d{3})\b/.exec(text)?.[1];return{error:text,needsAuth:auth.needsAuth,message:humanErrorSummary(text,auth.needsAuth,status)}}var accountIndex=new Map,accountContexts=new Set,accountResolutions=new Map;function registerAccountContext(getContext){return accountContexts.add(getContext),()=>accountContexts.delete(getContext)}function knownAccount(account){for(let getContext of[...accountContexts].reverse()){let{accounts=[],subscriptions=[]}=getContext(),metadata=accounts.find(a=>a.name===account);if(metadata)return{metadata,subscription:subscriptions.find(s=>s.subscriptionId===metadata.subscriptionId)}}return null}function completeAccount(metadata){return!!(metadata?.tenantId&&metadata.subscriptionId&&metadata.resourceGroup)}function rgFromId(id){let m=/\/resourceGroups\/([^/]+)\//i.exec(id||"");return m?m[1]:""}async function mapLimit(items,limit,fn){let results=[],i=0,workers=Array.from({length:Math.min(limit,items.length)},async()=>{for(;i<items.length;){let idx=i++;results[idx]=await fn(items[idx])}});return await Promise.all(workers),results}async function listStorageAccounts({concurrency=16}={}){let subs=await listSubscriptions(),{accounts,errors}=await listStorageAccountsForSubs(subs,{concurrency});if(errors.length)throw new Error(errors.map(e=>`${e.subscriptionName}: ${e.error}`).join("; "));return accounts}async function listStorageAccountsForSubs(subs,{concurrency=16,readAccounts=armGetAll}={}){let out=[],errors=[];return await mapLimit(subs,concurrency,async sub=>{let accts;try{if(!sub.tenantId)throw new Error("Subscription tenant is unknown. Refresh subscriptions.");accts=await readAccounts(`/subscriptions/${sub.subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=${API}`,sub.tenantId)}catch(e){errors.push({subscriptionName:sub.displayName||sub.subscriptionId,subscriptionId:sub.subscriptionId,tenantId:sub.tenantId,...discoveryFailure(e)});return}for(let a of accts){let acct={name:a.name,subscriptionId:sub.subscriptionId,subscriptionName:sub.displayName,tenantId:sub.tenantId,resourceGroup:rgFromId(a.id),location:a.location||"",sku:a.sku?.name||"",kind:a.kind||""};accountIndex.set(a.name,acct),out.push(acct)}}),out.sort((x,y)=>x.name.localeCompare(y.name)),{accounts:out,errors}}function accountMeta(account){let cached=accountIndex.get(account);if(completeAccount(cached))return cached;let known=knownAccount(account);if(!known)return cached||null;let metadata={...known.metadata,tenantId:known.metadata.tenantId||known.subscription?.tenantId,resourceGroup:known.metadata.resourceGroup||rgFromId(known.metadata.id)};return completeAccount(metadata)?(accountIndex.set(account,metadata),metadata):cached||null}async function ensureAccountMeta(account,{readAccounts=armGetAll}={}){let cached=accountMeta(account);if(completeAccount(cached))return cached;if(accountResolutions.has(account))return accountResolutions.get(account);let known=knownAccount(account),subscriptionId=known?.metadata.subscriptionId,tenantId=known?.metadata.tenantId||known?.subscription?.tenantId;if(!subscriptionId||!tenantId)throw new Error(`Storage account '${account}' has no known subscription or tenant context. Select its subscription before accessing storage.`);let pending=(async()=>{let result=await listStorageAccountsForSubs([{...known.subscription,subscriptionId,tenantId}],{readAccounts});if(result.errors.length)throw new Error(`Could not resolve storage account '${account}': ${result.errors[0].error}`);let resolved=result.accounts.find(a=>a.name===account);if(!completeAccount(resolved))throw new Error(`Storage account '${account}' was not returned with complete metadata in subscription '${subscriptionId}'. Refresh that subscription's accounts.`);return resolved})();accountResolutions.set(account,pending);try{return await pending}finally{accountResolutions.get(account)===pending&&accountResolutions.delete(account)}}async function getAccountConfig(account){try{let m=await ensureAccountMeta(account),j=await armGet(`/subscriptions/${m.subscriptionId}/resourceGroups/${m.resourceGroup}/providers/Microsoft.Storage/storageAccounts/${account}?api-version=${API}`,m.tenantId),p=j.properties||{};return{ok:!0,exists:!0,allowSharedKeyAccess:p.allowSharedKeyAccess!==!1,publicNetworkAccess:p.publicNetworkAccess||"Enabled",defaultAction:p.networkAcls?.defaultAction||"Allow",provisioningState:p.provisioningState||"",sku:j.sku?.name||"",location:j.location||""}}catch(err){return err.statusCode===404?{ok:!0,exists:!1}:{ok:!1,error:String(err?.message||err)}}}async function fetchAccountKey(account){let m=await ensureAccountMeta(account),key=(await armPost(`/subscriptions/${m.subscriptionId}/resourceGroups/${m.resourceGroup}/providers/Microsoft.Storage/storageAccounts/${account}/listKeys?api-version=${API}`,m.tenantId))?.keys?.[0]?.value;if(!key)throw new Error("listKeys returned no key");return key}var svcCache=new Map;function accountUrl(account){return`https://${account}.blob.core.windows.net`}async function probe(svc){await svc.listContainers().byPage({maxPageSize:1})[Symbol.asyncIterator]().next()}function isAuthError(e){let s=e?.statusCode??e?.response?.status;if(s===401||s===403)return!0;let txt=`${e?.code||e?.name||""} ${e?.message||""}`;return/Authoriz|Authentic|KeyBasedAuthenticationNotPermitted|InvalidAuthenticationInfo|NoAuthenticationInformation/i.test(txt)}async function buildEntry(account){await ensureAccountMeta(account);try{let key=await fetchAccountKey(account);return{svc:new BlobServiceClient(accountUrl(account),new StorageSharedKeyCredential(account,key)),mode:"sharedKey",key}}catch{return{svc:new BlobServiceClient(accountUrl(account),storageCredential(account)),mode:"aad",key:null}}}async function withBlob(account,fn){let entry=svcCache.get(account);entry||(entry=await buildEntry(account),svcCache.set(account,entry));try{return await fn(entry.svc)}catch(e){if(entry.mode==="sharedKey"&&isAuthError(e)){let aad={svc:new BlobServiceClient(accountUrl(account),storageCredential(account)),mode:"aad",key:null};return svcCache.set(account,aad),await fn(aad.svc)}throw e}}async function resolveBlobService(account){if(await ensureAccountMeta(account),svcCache.has(account))return svcCache.get(account);let keyErr=null,aadErr=null;try{let key=await fetchAccountKey(account),cred=new StorageSharedKeyCredential(account,key),svc=new BlobServiceClient(accountUrl(account),cred);await probe(svc);let entry={svc,mode:"sharedKey",key};return svcCache.set(account,entry),entry}catch(err){keyErr=err}try{let svc=new BlobServiceClient(accountUrl(account),storageCredential(account));await probe(svc);let entry={svc,mode:"aad",key:null};return svcCache.set(account,entry),entry}catch(err){aadErr=err}throw new Error(`Could not access '${account}': key fallback ${keyErr?.code||keyErr?.message||"n/a"}; AAD ${aadErr?.code||aadErr?.message||"n/a"}.`)}async function listContainers(account){return withBlob(account,async svc=>{let out=[];for await(let c of svc.listContainers())out.push({name:c.name,lastModified:c.properties?.lastModified||null});return out})}function mapBlob(b){return{name:b.name,size:b.properties?.contentLength??0,lastModified:b.properties?.lastModified?new Date(b.properties.lastModified).toISOString():null,contentType:b.properties?.contentType||"",accessTier:b.properties?.accessTier||"",blobType:b.properties?.blobType||"",tags:b.tags||null}}async function collectBlobs(cc,max,{prefix,onProgress,requireTags=!1}={}){let out=[],truncated=!1,read=async includeTags=>{for await(let b of cc.listBlobsFlat({prefix,includeTags})){if(out.length>=max){truncated=!0;break}out.push(mapBlob(b)),out.length%1e3===0&&onProgress?.(out.length)}onProgress?.(out.length)};try{await read(!0)}catch(error){if(error?.statusCode!==403||requireTags)throw error;out.length=0,truncated=!1,onProgress?.(0),await read(!1)}return out.truncated=truncated,out.limit=max,out}async function listBlobs(account,container,{max=5e3,complete=!1,...options}={}){return withBlob(account,svc=>collectBlobs(svc.getContainerClient(container),complete?1/0:max,options))}async function listBlobDirectory(account,container,{prefix="",max=5e3,list}={}){let collect=async(cc,includeTags)=>{let blobs=[],prefixes=[],truncated=!1;for await(let item of cc.listBlobsByHierarchy("/",{prefix,includeTags})){if(blobs.length+prefixes.length>=max){truncated=!0;break}item.kind==="prefix"?prefixes.push(item.name):blobs.push(mapBlob(item))}return{blobs,prefixes,truncated,limit:max}},read=async cc=>{try{return await collect(cc,!0)}catch(error){if(error?.statusCode!==403)throw error;return collect(cc,!1)}};return list?read({listBlobsByHierarchy:list}):withBlob(account,svc=>read(svc.getContainerClient(container)))}async function storagePage(iterator,continuationToken,maxPageSize=100){let result=await iterator.byPage({continuationToken:continuationToken||void 0,maxPageSize}).next();return result.done?{page:[],nextToken:null}:{page:result.value,nextToken:result.value.continuationToken||null}}async function listStoragePage({account,kind,resource,dir="",prefix="",token,sasUrl,resolve,tableClient}){let read=iterator=>storagePage(iterator,token);if(kind==="blob"||kind==="sas"){let fromClient=async svc=>{let cc=kind==="sas"?svc:resource?svc.getContainerClient(resource):null;if(!cc){let{page,nextToken}=await read(svc.listContainers());return{items:(page.containerItems||[]).map(c=>({name:c.name,lastModified:c.properties?.lastModified||null})),nextToken}}let result;try{result=await read(kind==="sas"?cc.listBlobsFlat({includeTags:!0}):cc.listBlobsByHierarchy("/",{prefix,includeTags:!0}))}catch(error){if(error?.statusCode!==403)throw error;result=await read(kind==="sas"?cc.listBlobsFlat():cc.listBlobsByHierarchy("/",{prefix}))}return{items:(result.page.segment?.blobItems||[]).map(mapBlob),prefixes:(result.page.segment?.blobPrefixes||[]).map(p=>p.name),nextToken:result.nextToken}};return kind==="sas"?fromClient(new ContainerClient(sasUrl)):resolve?fromClient((await resolve(account)).svc):withBlob(account,fromClient)}if(kind==="file"){let{svc}=await(resolve||resolveShareService)(account),{page,nextToken}=await read(resource?svc.getShareClient(resource).getDirectoryClient(dir).listFilesAndDirectories({includeTimestamps:!0}):svc.listShares());return{items:resource?[...(page.segment?.directoryItems||[]).map(x=>({name:x.name,kind:"directory",size:null,lastModified:null})),...(page.segment?.fileItems||[]).map(x=>({name:x.name,kind:"file",size:x.properties?.contentLength??0,lastModified:x.properties?.lastModified?new Date(x.properties.lastModified).toISOString():null}))]:(page.shareItems||[]).map(x=>({name:x.name,quotaGiB:x.properties?.quota??null})),nextToken}}if(kind==="queue"){let{svc}=await(resolve||resolveQueueService)(account),{page,nextToken}=await read(svc.listQueues());return{items:(page.queueItems||[]).map(x=>({name:x.name,approximateMessagesCount:null})),nextToken}}if(kind==="table"){let{svc,cred}=await(resolve||resolveTableService)(account),{page,nextToken}=await read(resource?(tableClient||new TableClient(tableUrl(account),resource,cred)).listEntities():svc.listTables());if(!resource)return{items:page.map(x=>({name:x.name})),nextToken};let columns=new Set(["partitionKey","rowKey","timestamp"]);return{entities:{rows:page.map(ent=>{let row={};for(let[key,value]of Object.entries(ent))key.startsWith("odata.")||key==="etag"||(columns.add(key),row[key]=value&&typeof value.toISOString=="function"?value.toISOString():value);return row}),columns:[...columns]},nextToken}}throw new Error("This storage view does not support continuation pages.")}async function createContainer(account,container,{resolve=resolveBlobService}={}){let{svc}=await resolve(account);return await svc.getContainerClient(container).create(),{ok:!0,container}}async function deleteContainer(account,container){let{svc}=await resolveBlobService(account);return await svc.getContainerClient(container).delete(),{ok:!0}}async function deleteBlob(account,container,name){let{svc}=await resolveBlobService(account);return await svc.getContainerClient(container).getBlockBlobClient(name).delete(),{ok:!0}}async function setBlobTier(account,container,name,tier){let{svc}=await resolveBlobService(account);return await svc.getContainerClient(container).getBlockBlobClient(name).setAccessTier(tier),{ok:!0}}async function uploadBlob(account,container,name,buffer,contentType){let{svc}=await resolveBlobService(account),cc=svc.getContainerClient(container);return await cc.createIfNotExists(),await cc.getBlockBlobClient(name).uploadData(buffer,contentType?{blobHTTPHeaders:{blobContentType:contentType}}:void 0),{ok:!0,name,size:buffer.length}}async function downloadBlob(account,container,name,{maxBytes=null}={}){let{svc}=await resolveBlobService(account),bc=svc.getContainerClient(container).getBlockBlobClient(name);if(Number.isFinite(maxBytes)&&maxBytes>0){let resp=await bc.download(0,maxBytes);return await streamToBuffer(resp.readableStreamBody)}return await bc.downloadToBuffer()}async function blobSize(account,container,name){let{svc}=await resolveBlobService(account),props=await svc.getContainerClient(container).getBlockBlobClient(name).getProperties();return Number(props.contentLength)||0}async function streamToBuffer(stream){let chunks=[];for await(let chunk of stream)chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk));return Buffer.concat(chunks)}async function generateBlobSas(account,container,name,{minutes=60,permissions="r"}={}){let entry=await resolveBlobService(account),perms=BlobSASPermissions.parse(permissions||"r"),startsOn=new Date(Date.now()-5*6e4),expiresOn=new Date(Date.now()+Math.max(1,minutes)*6e4),common={containerName:container,blobName:name,permissions:perms,startsOn,expiresOn,protocol:SASProtocol.Https},sas,mode;if(entry.mode==="sharedKey"&&entry.key){let cred=new StorageSharedKeyCredential(account,entry.key);sas=generateBlobSASQueryParameters(common,cred).toString(),mode="account-key"}else{let udk=await entry.svc.getUserDelegationKey(startsOn,expiresOn);sas=generateBlobSASQueryParameters(common,udk,account).toString(),mode="user-delegation"}let encName=name.split("/").map(encodeURIComponent).join("/");return{url:`${accountUrl(account)}/${container}/${encName}?${sas}`,expiresOn:expiresOn.toISOString(),permissions:permissions||"r",mode}}async function generateContainerSas(account,container,{minutes=1440,permissions="rl"}={}){let entry=await resolveBlobService(account),perms=ContainerSASPermissions.parse(permissions||"rl"),startsOn=new Date(Date.now()-5*6e4),expiresOn=new Date(Date.now()+Math.max(1,minutes)*6e4),common={containerName:container,permissions:perms,startsOn,expiresOn,protocol:SASProtocol.Https},sas,mode;if(entry.mode==="sharedKey"&&entry.key){let cred=new StorageSharedKeyCredential(account,entry.key);sas=generateBlobSASQueryParameters(common,cred).toString(),mode="account-key"}else{let udk=await entry.svc.getUserDelegationKey(startsOn,expiresOn);sas=generateBlobSASQueryParameters(common,udk,account).toString(),mode="user-delegation"}return{url:`${accountUrl(account)}/${container}?${sas}`,expiresOn:expiresOn.toISOString(),permissions:permissions||"rl",mode}}async function listSasBlobs(sasUrl,{max=5e3,complete=!1,...options}={}){let cc=new ContainerClient(sasUrl);return collectBlobs(cc,complete?1/0:max,options)}async function downloadSasBlob(sasUrl,name){return await new ContainerClient(sasUrl).getBlockBlobClient(name).downloadToBuffer()}var queueCache=new Map;function queueUrl(account){return`https://${account}.queue.core.windows.net`}async function resolveQueueService(account){if(await ensureAccountMeta(account),queueCache.has(account))return queueCache.get(account);let keyErr=null;try{let key=await fetchAccountKey(account),svc=new QueueServiceClient(queueUrl(account),new QueueSharedKey(account,key));await svc.listQueues().byPage({maxPageSize:1})[Symbol.asyncIterator]().next();let e={svc,mode:"sharedKey"};return queueCache.set(account,e),e}catch(err){keyErr=err}try{let svc=new QueueServiceClient(queueUrl(account),storageCredential(account));await svc.listQueues().byPage({maxPageSize:1})[Symbol.asyncIterator]().next();let e={svc,mode:"aad"};return queueCache.set(account,e),e}catch(err){throw new Error(`Could not access queues for '${account}': key ${keyErr?.code||keyErr?.message||"n/a"}; AAD ${err?.code||err?.message||"n/a"}.`)}}async function listQueues(account){let{svc}=await resolveQueueService(account),out=[];for await(let q of svc.listQueues()){let count=null;try{count=(await svc.getQueueClient(q.name).getProperties()).approximateMessagesCount??null}catch{}out.push({name:q.name,approximateMessagesCount:count})}return out}async function peekQueueMessages(account,queue,{max=32}={}){let{svc}=await resolveQueueService(account);return((await svc.getQueueClient(queue).peekMessages({numberOfMessages:Math.min(max,32)})).peekedMessageItems||[]).map(m=>({messageId:m.messageId,messageText:m.messageText,insertedOn:m.insertedOn?new Date(m.insertedOn).toISOString():null,dequeueCount:m.dequeueCount??0}))}function requireNewResource(items,name,kind){if(items.some(item=>item.name.toLowerCase()===name.toLowerCase()))throw new Error(`A ${kind} named "${name}" already exists. Choose a different name.`)}async function createQueue(account,queue){requireNewResource(await listQueues(account),queue,"queue");let{svc}=await resolveQueueService(account);return await svc.getQueueClient(queue).create(),{ok:!0}}async function deleteQueue(account,queue){let{svc}=await resolveQueueService(account);return await svc.getQueueClient(queue).delete(),{ok:!0}}async function sendQueueMessage(account,queue,text){let{svc}=await resolveQueueService(account);return{ok:!0,messageId:(await svc.getQueueClient(queue).sendMessage(String(text??""))).messageId}}async function clearQueueMessages(account,queue){let{svc}=await resolveQueueService(account);return await svc.getQueueClient(queue).clearMessages(),{ok:!0}}async function withReceivedMessage(account,queue,messageId,act){let{svc}=await resolveQueueService(account),qc=svc.getQueueClient(queue),msgs=(await qc.receiveMessages({numberOfMessages:32,visibilityTimeout:30})).receivedMessageItems||[],target=msgs.find(m=>m.messageId===messageId);for(let m of msgs)if(m.messageId!==messageId)try{await qc.updateMessage(m.messageId,m.popReceipt,void 0,0)}catch{}if(!target)throw new Error("That message isn't among the first 32 in the queue, so it can't be changed directly.");return await act(qc,target),{ok:!0}}async function updateQueueMessage(account,queue,messageId,text){return withReceivedMessage(account,queue,messageId,(qc,target)=>qc.updateMessage(messageId,target.popReceipt,String(text??""),0))}async function deleteQueueMessage(account,queue,messageId){return withReceivedMessage(account,queue,messageId,(qc,target)=>qc.deleteMessage(messageId,target.popReceipt))}var tableCache=new Map;function tableUrl(account){return`https://${account}.table.core.windows.net`}async function resolveTableService(account){if(await ensureAccountMeta(account),tableCache.has(account))return tableCache.get(account);let keyErr=null;try{let key=await fetchAccountKey(account),cred=new AzureNamedKeyCredential(account,key),svc=new TableServiceClient(tableUrl(account),cred);await svc.listTables().byPage({maxPageSize:1})[Symbol.asyncIterator]().next();let e={svc,mode:"sharedKey",cred};return tableCache.set(account,e),e}catch(err){keyErr=err}try{let cred=storageCredential(account),svc=new TableServiceClient(tableUrl(account),cred);await svc.listTables().byPage({maxPageSize:1})[Symbol.asyncIterator]().next();let e={svc,mode:"aad",cred};return tableCache.set(account,e),e}catch(err){throw new Error(`Could not access tables for '${account}': key ${keyErr?.code||keyErr?.message||"n/a"}; AAD ${err?.code||err?.message||"n/a"}.`)}}async function listTables(account){let{svc}=await resolveTableService(account),out=[];for await(let t of svc.listTables())out.push({name:t.name});return out}async function queryTableEntities(account,table,{max=100}={}){let{cred}=await resolveTableService(account),tc=new TableClient(tableUrl(account),table,cred),rows=[],cols=new Set(["partitionKey","rowKey","timestamp"]);for await(let ent of tc.listEntities()){let row={};for(let k of Object.keys(ent)){if(k.startsWith("odata.")||k==="etag")continue;cols.add(k);let v=ent[k];row[k]=v&&typeof v=="object"&&typeof v.toISOString=="function"?v.toISOString():v}if(rows.push(row),rows.length>=max)break}return{columns:Array.from(cols),rows}}async function createTable(account,table){requireNewResource(await listTables(account),table,"table");let{svc}=await resolveTableService(account);return await svc.createTable(table),{ok:!0}}async function deleteTable(account,table){let{svc}=await resolveTableService(account);return await svc.deleteTable(table),{ok:!0}}async function upsertEntity(account,table,entity){if(!entity||!entity.partitionKey||!entity.rowKey)throw new Error("entity requires partitionKey and rowKey");let{cred}=await resolveTableService(account);return await new TableClient(tableUrl(account),table,cred).upsertEntity(entity,"Merge"),{ok:!0}}async function deleteEntity(account,table,partitionKey,rowKey){let{cred}=await resolveTableService(account);return await new TableClient(tableUrl(account),table,cred).deleteEntity(partitionKey,rowKey),{ok:!0}}var shareCache=new Map;function fileUrl(account){return`https://${account}.file.core.windows.net`}async function resolveShareService(account){if(await ensureAccountMeta(account),shareCache.has(account))return shareCache.get(account);let keyErr=null;try{let key=await fetchAccountKey(account),svc=new ShareServiceClient(fileUrl(account),new FileSharedKey(account,key));await svc.listShares().byPage({maxPageSize:1})[Symbol.asyncIterator]().next();let e={svc,mode:"sharedKey"};return shareCache.set(account,e),e}catch(err){keyErr=err}try{let svc=new ShareServiceClient(fileUrl(account),storageCredential(account),{fileRequestIntent:"backup"});await svc.listShares().byPage({maxPageSize:1})[Symbol.asyncIterator]().next();let e={svc,mode:"aad"};return shareCache.set(account,e),e}catch(err){throw new Error(`Could not access file shares for '${account}': key ${keyErr?.code||keyErr?.message||"n/a"}; AAD ${err?.code||err?.message||"n/a"}.`)}}async function listShares(account){let{svc}=await resolveShareService(account),out=[];for await(let s of svc.listShares())out.push({name:s.name,quotaGiB:s.properties?.quota??null});return out}async function listShareItems(account,share,dir="",{resolve=resolveShareService}={}){let{svc}=await resolve(account),dc=svc.getShareClient(share).getDirectoryClient(dir||""),out=[];for await(let item of dc.listFilesAndDirectories({includeTimestamps:!0}))out.push({name:item.name,kind:item.kind,size:item.kind==="file"?item.properties?.contentLength??0:null,lastModified:item.kind==="file"&&item.properties?.lastModified?new Date(item.properties.lastModified).toISOString():null});return out}async function createShare(account,share){requireNewResource(await listShares(account),share,"file share");let{svc}=await resolveShareService(account);return await svc.getShareClient(share).create(),{ok:!0}}async function deleteShare(account,share){let{svc}=await resolveShareService(account);return await svc.getShareClient(share).delete(),{ok:!0}}async function createShareDirectory(account,share,dir){let{svc}=await resolveShareService(account);return await svc.getShareClient(share).getDirectoryClient(dir).create(),{ok:!0}}async function uploadShareFile(account,share,name,buffer,dir="",{resolve=resolveShareService}={}){let{svc}=await resolve(account),fc=svc.getShareClient(share).getDirectoryClient(dir).getFileClient(name);return await fc.create(buffer.length),buffer.length&&await fc.uploadData(buffer),{ok:!0,size:buffer.length}}async function downloadShareFile(account,share,name,dir="",{resolve=resolveShareService}={}){let{svc}=await resolve(account);return await svc.getShareClient(share).getDirectoryClient(dir).getFileClient(name).downloadToBuffer()}async function deleteShareItem(account,share,name,kind,dir="",{resolve=resolveShareService}={}){let{svc}=await resolve(account),sc=svc.getShareClient(share);return kind==="directory"?await sc.getDirectoryClient(dir?`${dir}/${name}`:name).delete():await sc.getDirectoryClient(dir).getFileClient(name).delete(),{ok:!0}}function fmtBytes(n){if(n=Number(n)||0,n<1024)return`${n} B`;let u=["KB","MB","GB","TB","PB"],i=-1;do n/=1024,i++;while(n>=1024&&i<u.length-1);return`${n.toFixed(n>=10?0:1)} ${u[i]}`}function globToRe(glob){let body=String(glob).replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp("^"+body+"$","i")}function typeFamily(contentType,name){let ct=String(contentType||"").toLowerCase(),ext=String(name||"").toLowerCase().split(".").pop();return/^image\//.test(ct)||/^(png|jpe?g|gif|webp|bmp|svg|tiff?)$/.test(ext)?"image":/^video\//.test(ct)||/^(mp4|mov|avi|mkv|webm)$/.test(ext)?"video":/^audio\//.test(ct)||/^(mp3|wav|flac|ogg|m4a)$/.test(ext)?"audio":/json|xml|csv|text\/|javascript|yaml/.test(ct)||/^(json|xml|csv|txt|log|md|yaml|yml|js|ts|html?|css)$/.test(ext)?"text/data":/pdf|word|excel|powerpoint|officedocument|msword/.test(ct)||/^(pdf|docx?|xlsx?|pptx?)$/.test(ext)?"document":/zip|gzip|tar|compress|x-7z|rar/.test(ct)||/^(zip|gz|tar|7z|rar|bz2)$/.test(ext)?"archive":/octet-stream/.test(ct)||/^(bin|dat|iso|vhd|img)$/.test(ext)?"binary":ct.split("/")[0]||"other"}function applyBlobFilter(blobs,c={}){let list=Array.isArray(blobs)?blobs:[],nowMs=c.now?Date.parse(c.now):Date.now(),re=c.namePattern&&String(c.namePattern).trim()?globToRe(String(c.namePattern).trim()):null,prefix=c.prefix!=null&&String(c.prefix)!==""?String(c.prefix).toLowerCase():null,suffix=c.suffix!=null&&String(c.suffix)!==""?String(c.suffix).toLowerCase():null,contains=c.contains!=null&&String(c.contains)!==""?String(c.contains).toLowerCase():null,min=c.minSize!=null&&c.minSize!==""?Number(c.minSize):null,max=c.maxSize!=null&&c.maxSize!==""?Number(c.maxSize):null,older=c.olderThanDays!=null&&c.olderThanDays!==""?Number(c.olderThanDays):null,newer=c.newerThanDays!=null&&c.newerThanDays!==""?Number(c.newerThanDays):null,type=c.type&&String(c.type).trim()&&c.type!=="all"?String(c.type).trim():null,tiers=normList(c.tiers).map(t=>t.toLowerCase()),blobTypes=normList(c.blobTypes).map(t=>t.toLowerCase()),tagKeys=normList(c.tagKeys),tags=c.tags&&typeof c.tags=="object"?c.tags:null,DAY=864e5;return list.filter(b=>{let nm=String(b.name||""),nml=nm.toLowerCase();if(re&&!re.test(nm)||prefix&&!nml.startsWith(prefix)||suffix&&!nml.endsWith(suffix)||contains&&nml.indexOf(contains)===-1)return!1;let sz=Number(b.size)||0;if(min!=null&&sz<min||max!=null&&sz>max)return!1;if((older!=null||newer!=null)&&b.lastModified){let ageMs=nowMs-Date.parse(b.lastModified);if(older!=null&&!(ageMs>older*DAY)||newer!=null&&!(ageMs<=newer*DAY))return!1}else if(older!=null||newer!=null)return!1;if(type&&typeFamily(b.contentType,b.name)!==type||tiers.length&&tiers.indexOf(String(b.accessTier||"").toLowerCase())===-1||blobTypes.length&&blobTypes.indexOf(String(b.blobType||"").toLowerCase())===-1)return!1;if(tagKeys.length){let bt=b.tags||{};for(let k of tagKeys)if(!(k in bt))return!1}if(tags){let bt=b.tags||{};for(let k of Object.keys(tags))if(String(bt[k])!==String(tags[k]))return!1}return!0})}function normList(v){return v==null||v===""?[]:Array.isArray(v)?v.map(x=>String(x).trim()).filter(Boolean):String(v).split(",").map(x=>x.trim()).filter(Boolean)}function computeBlobStats(blobs){let list=Array.isArray(blobs)?blobs:[],n=list.length,sizes=list.map(b=>Number(b.size)||0),total=sizes.reduce((a,s)=>a+s,0),max=n?Math.max(...sizes):0,avg=n?Math.round(total/n):0,buckets=[{label:"0\u20131 KB",lo:0,hi:1024},{label:"1 KB\u20131 MB",lo:1024,hi:1048576},{label:"1\u2013100 MB",lo:1048576,hi:104857600},{label:"100 MB\u20131 GB",lo:104857600,hi:1073741824},{label:">1 GB",lo:1073741824,hi:1/0}].map(bk=>({label:bk.label,n:sizes.filter(s=>s>=bk.lo&&s<bk.hi).length})),byTypeMap=new Map;for(let b of list){let fam=typeFamily(b.contentType,b.name),cur=byTypeMap.get(fam)||{n:0,bytes:0};cur.n++,cur.bytes+=Number(b.size)||0,byTypeMap.set(fam,cur)}let byType=[...byTypeMap.entries()].map(([label,v])=>({label,n:v.n,bytes:v.bytes})).sort((a,b)=>b.bytes-a.bytes),byTierMap=new Map;for(let b of list){let tier=String(b.accessTier||"").trim()||"\u2014",cur=byTierMap.get(tier)||{n:0,bytes:0};cur.n++,cur.bytes+=Number(b.size)||0,byTierMap.set(tier,cur)}let byTier=[...byTierMap.entries()].map(([label,v])=>({label,n:v.n,bytes:v.bytes})).sort((a,b)=>b.bytes-a.bytes),hasTier=byTier.some(t=>t.label!=="\u2014"),byExtMap=new Map;for(let b of list){let parts=String(b.name||"").toLowerCase().split("."),ext=parts.length>1?"."+parts.pop():"(none)",cur=byExtMap.get(ext)||{n:0,bytes:0};cur.n++,cur.bytes+=Number(b.size)||0,byExtMap.set(ext,cur)}let byExt=[...byExtMap.entries()].map(([label,v])=>({label,n:v.n,bytes:v.bytes})).sort((a,b)=>b.bytes-a.bytes).slice(0,8),topLargest=[...list].sort((a,b)=>(Number(b.size)||0)-(Number(a.size)||0)).slice(0,10).map(b=>({name:b.name,size:Number(b.size)||0,sizeh:fmtBytes(b.size),lastModified:b.lastModified||null}));return{count:n,totalBytes:total,totalh:fmtBytes(total),avgBytes:avg,avgh:fmtBytes(avg),maxBytes:max,maxh:fmtBytes(max),buckets,byType,byTier:hasTier?byTier:[],byExt,topLargest}}function filterAndStat(blobs,criteria={}){let filtered=applyBlobFilter(blobs,criteria);return{filtered,stats:computeBlobStats(filtered),criteria}}var OVERWRITE={overwrite:"true",skip:"false","if-newer":"ifSourceNewer"};function resolutionFlag(resolution){return OVERWRITE[resolution]||"true"}function planTransfer(sourceBlobs,destBlobs,resolution="overwrite"){let src=Array.isArray(sourceBlobs)?sourceBlobs:[],dstByName=new Map((Array.isArray(destBlobs)?destBlobs:[]).map(b=>[b.name,b])),conflicts=[],newFiles=[];for(let b of src)dstByName.has(b.name)?conflicts.push(b):newFiles.push(b);let toTransfer;if(resolution==="skip")toTransfer=newFiles.slice();else if(resolution==="if-newer"){let newerConflicts=conflicts.filter(b=>{let d=dstByName.get(b.name),s=Date.parse(b.lastModified||""),dm=Date.parse(d?.lastModified||"");return Number.isFinite(s)&&Number.isFinite(dm)?s>dm:!0});toTransfer=newFiles.concat(newerConflicts)}else toTransfer=src.slice();let bytes=toTransfer.reduce((a,b)=>a+(Number(b.size)||0),0),skipped=src.length-toTransfer.length;return{resolution,sourceCount:src.length,destCount:dstByName.size,conflictCount:conflicts.length,newCount:newFiles.length,transferCount:toTransfer.length,skippedCount:skipped,transferBytes:bytes,transferBytesh:fmtBytes(bytes),conflicts:conflicts.slice(0,100).map(b=>({name:b.name,size:Number(b.size)||0,sizeh:fmtBytes(b.size),lastModified:b.lastModified||null})),toTransfer:toTransfer.map(b=>b.name)}}function azcopyCommand({sourceUrl,destUrl,resolution="overwrite",includeNames=null,allSource=!1}={}){let q=s=>`"${String(s||"").replace(/[\\"$`]/g,"\\$&")}"`,flags=[`--overwrite=${resolutionFlag(resolution)}`];if(allSource)flags.push("--recursive");else if(Array.isArray(includeNames)){if(!includeNames.length)return{command:null,needsLogin:!1,empty:!0};flags.push(`--include-path ${q(includeNames.join(";"))}`),flags.push("--recursive")}else flags.push("--recursive");let needsLogin=!/[?&]sig=/.test(String(sourceUrl||""))||!/[?&]sig=/.test(String(destUrl||""));return{command:`azcopy copy ${q(sourceUrl)} ${q(destUrl)} ${flags.join(" ")}`,needsLogin}}function sniffText(bytes){let buf=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes||[]);if(!buf.length)return{isText:!0,text:""};let control=0;for(let i=0;i<buf.length;i++){let c=buf[i];if(c===0)return{isText:!1,text:null};(c<9||c>13&&c<32||c===127)&&control++}if(control/buf.length>.1)return{isText:!1,text:null};try{let text=new TextDecoder("utf-8",{fatal:!1}).decode(buf);return(text.match(/\uFFFD/g)||[]).length/Math.max(text.length,1)>.1?{isText:!1,text:null}:{isText:!0,text}}catch{return{isText:!1,text:null}}}var MAGIC=[{off:0,hex:"67 6C 54 46",format:"glTF binary (GLB) 3D model",category:"3D model"},{off:0,hex:"89 50 4E 47 0D 0A 1A 0A",format:"PNG image",category:"image"},{off:0,hex:"FF D8 FF",format:"JPEG image",category:"image"},{off:0,hex:"47 49 46 38",format:"GIF image",category:"image"},{off:0,hex:"42 4D",format:"BMP image",category:"image"},{off:0,hex:"49 49 2A 00",format:"TIFF image (little-endian)",category:"image"},{off:0,hex:"4D 4D 00 2A",format:"TIFF image (big-endian)",category:"image"},{off:0,hex:"00 00 01 00",format:"ICO icon",category:"image"},{off:0,hex:"25 50 44 46",format:"PDF document",category:"document"},{off:0,hex:"D0 CF 11 E0 A1 B1 1A E1",format:"Legacy MS Office (OLE2: .doc/.xls/.ppt)",category:"document"},{off:0,hex:"50 4B 03 04",format:"ZIP archive (or OOXML .docx/.xlsx/.pptx, JAR, APK)",category:"archive"},{off:0,hex:"50 4B 05 06",format:"ZIP archive (empty)",category:"archive"},{off:0,hex:"1F 8B",format:"gzip archive",category:"archive"},{off:0,hex:"42 5A 68",format:"bzip2 archive",category:"archive"},{off:0,hex:"37 7A BC AF 27 1C",format:"7-Zip archive",category:"archive"},{off:0,hex:"52 61 72 21 1A 07",format:"RAR archive",category:"archive"},{off:0,hex:"FD 37 7A 58 5A 00",format:"XZ archive",category:"archive"},{off:257,hex:"75 73 74 61 72",format:"TAR archive",category:"archive"},{off:0,hex:"7F 45 4C 46",format:"ELF executable / shared object",category:"executable"},{off:0,hex:"4D 5A",format:"Windows PE executable (.exe/.dll)",category:"executable"},{off:0,hex:"CA FE BA BE",format:"Java class file",category:"executable"},{off:0,hex:"00 61 73 6D",format:"WebAssembly (WASM) module",category:"executable"},{off:0,hex:"4F 67 67 53",format:"Ogg media",category:"audio"},{off:0,hex:"49 44 33",format:"MP3 audio (ID3)",category:"audio"},{off:0,hex:"66 4C 61 43",format:"FLAC audio",category:"audio"},{off:0,hex:"53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00",format:"SQLite database",category:"database"},{off:0,hex:"50 41 52 31",format:"Apache Parquet",category:"data"},{off:0,hex:"4F 62 6A 01",format:"Apache Avro",category:"data"}],EXT_FORMAT={glb:["glTF binary (GLB) 3D model","3D model"],gltf:["glTF 3D model","3D model"],obj:["Wavefront OBJ 3D model","3D model"],fbx:["Autodesk FBX 3D model","3D model"],stl:["STL 3D model","3D model"],usdz:["USDZ 3D scene","3D model"],ply:["PLY 3D model","3D model"],png:["PNG image","image"],jpg:["JPEG image","image"],jpeg:["JPEG image","image"],gif:["GIF image","image"],webp:["WebP image","image"],bmp:["BMP image","image"],tiff:["TIFF image","image"],ico:["ICO icon","image"],heic:["HEIC image","image"],avif:["AVIF image","image"],svg:["SVG vector image","image"],psd:["Photoshop document","image"],pdf:["PDF document","document"],docx:["Word document (OOXML)","document"],xlsx:["Excel workbook (OOXML)","document"],pptx:["PowerPoint deck (OOXML)","document"],doc:["Legacy Word document","document"],xls:["Legacy Excel workbook","document"],ppt:["Legacy PowerPoint deck","document"],zip:["ZIP archive","archive"],gz:["gzip archive","archive"],tgz:["gzip TAR archive","archive"],tar:["TAR archive","archive"],rar:["RAR archive","archive"],"7z":["7-Zip archive","archive"],bz2:["bzip2 archive","archive"],xz:["XZ archive","archive"],zst:["Zstandard archive","archive"],mp3:["MP3 audio","audio"],wav:["WAV audio","audio"],flac:["FLAC audio","audio"],ogg:["Ogg audio","audio"],m4a:["AAC audio","audio"],mp4:["MP4 video","video"],mov:["QuickTime video","video"],avi:["AVI video","video"],mkv:["Matroska video","video"],webm:["WebM video","video"],exe:["Windows executable","executable"],dll:["Windows library","executable"],so:["Shared object","executable"],wasm:["WebAssembly module","executable"],parquet:["Apache Parquet","data"],avro:["Apache Avro","data"],orc:["Apache ORC","data"],db:["SQLite database","database"],sqlite:["SQLite database","database"],bin:["Raw binary","binary"],dat:["Raw data","binary"]};function hexHead(buf,n=16){let out=[];for(let i=0;i<Math.min(buf.length,n);i++)out.push(buf[i].toString(16).padStart(2,"0").toUpperCase());return out.join(" ")}function extFormat(name){let m=/\.([a-z0-9]+)$/i.exec(String(name||"")),ext=m?m[1].toLowerCase():"",g=EXT_FORMAT[ext];return g?{format:g[0],category:g[1],viaExt:!0}:{format:ext?ext.toUpperCase()+" file":"unknown binary",category:"binary",viaExt:!0}}function sniffBinaryFormat(bytes,name){let buf=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes||[]),magicHex=hexHead(buf),at=(off,hex)=>{let sig=hex.split(" ").map(h=>parseInt(h,16));if(off+sig.length>buf.length)return!1;for(let i=0;i<sig.length;i++)if(buf[off+i]!==sig[i])return!1;return!0};for(let m of MAGIC)if(at(m.off||0,m.hex))return{format:m.format,category:m.category,magicHex,viaExt:!1};if(at(0,"52 49 46 46"))return at(8,"57 45 42 50")?{format:"WebP image",category:"image",magicHex,viaExt:!1}:at(8,"57 41 56 45")?{format:"WAV audio",category:"audio",magicHex,viaExt:!1}:at(8,"41 56 49 20")?{format:"AVI video",category:"video",magicHex,viaExt:!1}:{format:"RIFF container",category:"media",magicHex,viaExt:!1};if(at(4,"66 74 79 70")){let brand=String.fromCharCode(buf[8]||32,buf[9]||32,buf[10]||32,buf[11]||32).trim(),cat=/hei|avif|mif/i.test(brand)?"image":"video";return{format:"ISO media (MP4/MOV/HEIC, brand '"+brand+"')",category:cat,magicHex,viaExt:!1}}let e=extFormat(name);return{format:e.format,category:e.category,magicHex,viaExt:!0}}var IMAGE_MIME={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",jfif:"image/jpeg",gif:"image/gif",webp:"image/webp",bmp:"image/bmp",ico:"image/x-icon",avif:"image/avif",apng:"image/apng"};function imageMime(name){let m=/\.([a-z0-9]+)$/i.exec(String(name||"")),ext=m?m[1].toLowerCase():"";return IMAGE_MIME[ext]||null}function parseGlb(bytes){let buf=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes||[]);if(buf.length<12)return null;let dv=new DataView(buf.buffer,buf.byteOffset,buf.byteLength);if(dv.getUint32(0,!0)!==1179937895)return null;let version=dv.getUint32(4,!0),off=12,json=null;for(;off+8<=buf.length;){let clen=dv.getUint32(off,!0),ctype=dv.getUint32(off+4,!0),dstart=off+8,dend=dstart+clen;if(ctype===1313821514){if(dend>buf.length)return{version,truncated:!0};json=new TextDecoder("utf-8").decode(buf.subarray(dstart,dend));break}off=dend}if(json==null)return{version,truncated:!0};let g;try{g=JSON.parse(json)}catch{return{version,truncated:!0}}let n=a=>Array.isArray(a)?a.length:0,accessors=g.accessors||[],vertices=0,triangles=0;for(let mesh of g.meshes||[])for(let prim of mesh.primitives||[]){let posIdx=prim.attributes&&prim.attributes.POSITION;posIdx!=null&&accessors[posIdx]&&(vertices+=accessors[posIdx].count||0),prim.indices!=null&&accessors[prim.indices]&&(triangles+=Math.floor((accessors[prim.indices].count||0)/3))}return{version,truncated:!1,meshes:n(g.meshes),materials:n(g.materials),textures:n(g.textures),images:n(g.images),animations:n(g.animations),nodes:n(g.nodes),accessors:n(g.accessors),vertices,triangles,generator:g.asset&&g.asset.generator||null,gltfVersion:g.asset&&g.asset.version||null}}function previewLang(name){let m=/\.([a-z0-9]+)$/i.exec(String(name||"")),ext=m?m[1].toLowerCase():"";return{json:"json",ndjson:"json",js:"javascript",mjs:"javascript",ts:"typescript",csv:"csv",tsv:"csv",xml:"xml",html:"html",htm:"html",md:"markdown",yml:"yaml",yaml:"yaml",log:"log",txt:"text",ini:"ini",conf:"ini",sql:"sql",sh:"shell",py:"python",cs:"csharp"}[ext]||ext||"text"}function parseSasUrl(rawUrl){let u;try{u=new URL(String(rawUrl||"").trim())}catch{return{ok:!1,error:"That doesn't look like a URL."}}if(u.protocol!=="https:"){let emulator=/^(127\.0\.0\.1|localhost|\[::1\])$/i.test(u.hostname);if(!(u.protocol==="http:"&&emulator))return{ok:!1,error:"SAS URL must use HTTPS \u2014 a SAS signature is a bearer credential and must not travel over plain HTTP."}}let q=u.searchParams;if(!q.get("sig"))return{ok:!1,error:"No SAS signature (sig=) in the URL \u2014 that's a plain URL, not a SAS."};let host=u.hostname,accountMatch=/^([^.]+)\.blob\./.exec(host),account=accountMatch?accountMatch[1]:host,segs=u.pathname.replace(/^\/+/,"").split("/"),container=segs[0]||"",blobPath=segs.slice(1).join("/"),perms=q.get("sp")||"",expiry=q.get("se")||"",resource=q.get("sr")||(blobPath?"b":container?"c":""),now=Date.now(),expMs=expiry?Date.parse(expiry):NaN,expired=Number.isFinite(expMs)&&expMs<now;return{ok:!0,account,container,blobPath,permissions:perms,canList:/l/i.test(perms),canRead:/r/i.test(perms),canWrite:/[wac]/i.test(perms),canDelete:/d/i.test(perms),expiresOn:expiry||null,expired,resource,containerUrl:`${u.protocol}//${u.host}/${container}${u.search}`}}function describeSas(p){if(!p?.ok)return p?.error||"Invalid SAS.";let acts=[p.canRead&&"read",p.canList&&"list",p.canWrite&&"write",p.canDelete&&"delete"].filter(Boolean).join(", ")||"none",exp=p.expiresOn?p.expired?`EXPIRED ${p.expiresOn}`:`expires ${p.expiresOn}`:"no expiry";return`Account ${p.account} \xB7 container '${p.container||"(none)"}' \xB7 can ${acts} \xB7 ${exp}`}function blobSasUrl(sasUrl,name){let p=parseSasUrl(sasUrl);if(!p.ok||!p.container)return null;let u;try{u=new URL(String(sasUrl).trim())}catch{return null}let enc=String(name).split("/").map(encodeURIComponent).join("/");return`${u.protocol}//${u.host}/${p.container}/${enc}${u.search}`}async function listSasBlobs2(sasUrl,options){let p=parseSasUrl(sasUrl);if(!p.ok)throw new Error(p.error);if(!p.container)throw new Error("This SAS has no container in its path \u2014 need a container SAS URL.");if(p.expired)throw new Error(`This SAS expired on ${p.expiresOn}.`);if(!p.canList)throw new Error("This SAS can't LIST (no 'l' permission) \u2014 ask for a list-enabled SAS.");let blobs=await listSasBlobs(p.containerUrl,options);return{account:p.account,container:p.container,permissions:p.permissions,expiresOn:p.expiresOn,blobs}}async function downloadSasBlob2(sasUrl,name){let p=parseSasUrl(sasUrl);if(!p.ok)throw new Error(p.error);if(p.expired)throw new Error(`This SAS expired on ${p.expiresOn}.`);if(!p.canRead)throw new Error("This SAS can't READ (no 'r' permission).");let buf=await downloadSasBlob(p.containerUrl,name);return{name,contentBase64:buf.toString("base64"),contentType:"application/octet-stream",size:buf.length}}import{execFile as execFile2}from"node:child_process";var AZCOPY_INSTALL_URL="https://aka.ms/downloadazcopy",azcopyProbe=null;function azcopyDoctor({refresh=!1}={}){return azcopyProbe&&!refresh||(azcopyProbe=new Promise(resolve=>{let done=!1,finish=value=>{done||(done=!0,resolve(value))};execFile2("azcopy",["--version"],{timeout:4e3,windowsHide:!0},(err,stdout)=>{if(err){let missing=err.code==="ENOENT";finish({installed:!1,version:null,reason:missing?"notFound":"error",hint:missing?`AzCopy isn't on your PATH. Install it from ${AZCOPY_INSTALL_URL}, then re-open the transfer plan.`:`AzCopy was found but couldn't be queried (${String(err.message||err).slice(0,120)}).`,installUrl:AZCOPY_INSTALL_URL});return}let version=(String(stdout||"").match(/\d+\.\d+\.\d+/)||[])[0]||null;finish({installed:!0,version,reason:"ok",hint:null,installUrl:AZCOPY_INSTALL_URL})}).on("error",()=>finish({installed:!1,version:null,reason:"notFound",hint:`AzCopy isn't on your PATH. Install it from ${AZCOPY_INSTALL_URL}, then re-open the transfer plan.`,installUrl:AZCOPY_INSTALL_URL}))})),azcopyProbe}import"node:fs";var BUILD_INFO=resolveStudioBuildInfo(new URL("./extension.mjs",import.meta.url));import"node:fs";var TENANT_ICON=`<svg id="uuid-f8d4d392-7c12-4bd9-baff-66fbf7814b91" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <path d="m3.802,14.032c.388.242,1.033.511,1.715.511.621,0,1.198-.18,1.676-.487,0,0,.001,0,.002-.001l1.805-1.128v4.073c-.286,0-.574-.078-.824-.234l-4.374-2.734Z" fill="#225086"/>
  <path d="m7.853,1.507L.353,9.967c-.579.654-.428,1.642.323,2.111,0,0,2.776,1.735,3.126,1.954.388.242,1.033.511,1.715.511.621,0,1.198-.18,1.676-.487,0,0,.001,0,.002-.001l1.805-1.128-4.364-2.728,4.365-4.924V1s0,0,0,0c-.424,0-.847.169-1.147.507Z" fill="#6df"/>
  <polygon points="4.636 10.199 4.688 10.231 9 12.927 9.001 12.927 9.001 12.927 9.001 5.276 9 5.275 4.636 10.199" fill="#cbf8ff"/>
  <path d="m17.324,12.078c.751-.469.902-1.457.323-2.111l-4.921-5.551c-.397-.185-.842-.291-1.313-.291-.925,0-1.752.399-2.302,1.026l-.109.123h0s4.364,4.924,4.364,4.924h0s0,0,0,0l-4.365,2.728v4.073c.287,0,.573-.078.823-.234l7.5-4.688Z" fill="#074793"/>
  <path d="m9.001,1v4.275s.109-.123.109-.123c.55-.627,1.377-1.026,2.302-1.026.472,0,.916.107,1.313.291l-2.579-2.909c-.299-.338-.723-.507-1.146-.507Z" fill="#0294e4"/>
  <polygon points="13.365 10.199 13.365 10.199 13.365 10.199 9.001 5.276 9.001 12.926 13.365 10.199" fill="#96bcc2"/>
</svg>`,AZURE_BRAND_ICON=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="f069caa6-84f1-4be4-82b7-9c017f3ae32f" x1="-805.6954" y1="119.6377" x2="-814.6074" y2="93.3095" gradientTransform="matrix(1, 0, 0, -1, 820, 124)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#114a8b"/>
      <stop offset="1" stop-color="#0669bc"/>
    </linearGradient>
    <linearGradient id="f16358cd-6714-426a-b248-367e0a42901f" x1="-804.0632" y1="120.4059" x2="-794.2807" y2="94.3426" gradientTransform="matrix(1, 0, 0, -1, 820, 124)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3ccbf4"/>
      <stop offset="1" stop-color="#2892df"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M11.1607,2.3374h8.5975L10.845,28.747a1.3459,1.3459,0,0,1-1.2753.9156H2.8471a1.3461,1.3461,0,0,1-1.2754-1.7765L9.8855,3.2529A1.3459,1.3459,0,0,1,11.1607,2.3374Z" fill="url(#f069caa6-84f1-4be4-82b7-9c017f3ae32f)"/>
    <path d="M23.0312,19.5421H9.4814a.6262.6262,0,0,0-.4273,1.0838L18.3458,29.3a1.3464,1.3464,0,0,0,.9187.3622h7.6789Z" fill="#0078d4"/>
    <g opacity="0.5">
      <path d="M20.6189,29.6626h6.3166l-3.9122-10.12H17.8716l2.98,8.821A1.3612,1.3612,0,0,1,20.6189,29.6626Z"/>
      <path d="M15.9112,13.73,19.7563,2.3374h-7.801a1.3608,1.3608,0,0,1,.2605.4559Z"/>
    </g>
    <g opacity="0.5">
      <path d="M11.4683,2.3374,15.66,14.48l.5808-1.7274-3.51-10.4155Z" fill-opacity="0.5"/>
      <path d="M19.41,29.6625l7.5257,0-5.714,0a1.8586,1.8586,0,0,0,.1106-1.4616l-2.9256-8.6588h-1.07l3.0352,8.9833a.8612.8612,0,0,1-.816,1.1371Z" fill-opacity="0.5"/>
    </g>
    <path d="M22.1146,3.253a1.346,1.346,0,0,0-1.2754-.9156H11.261a1.366,1.366,0,0,1,1.2944.9293l8.3,24.5931a1.366,1.366,0,0,1-1.2942,1.8028h9.5915a1.3461,1.3461,0,0,0,1.2754-1.7765Z" fill="url(#f16358cd-6714-426a-b248-367e0a42901f)"/>
  </g>
</svg>`,RESOURCE_ICONS={account:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <defs>
    <linearGradient id="ad4c4f96-09aa-4f91-ba10-5cb8ad530f74" x1="9" y1="15.83" x2="9" y2="5.79" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#b3b3b3" />
      <stop offset="0.26" stop-color="#c1c1c1" />
      <stop offset="1" stop-color="#e6e6e6" />
    </linearGradient>
  </defs>
  <path d="M.5,5.79h17a0,0,0,0,1,0,0v9.48a.57.57,0,0,1-.57.57H1.07a.57.57,0,0,1-.57-.57V5.79A0,0,0,0,1,.5,5.79Z" fill="url(#ad4c4f96-09aa-4f91-ba10-5cb8ad530f74)" />
  <path d="M1.07,2.17H16.93a.57.57,0,0,1,.57.57V5.79a0,0,0,0,1,0,0H.5a0,0,0,0,1,0,0V2.73A.57.57,0,0,1,1.07,2.17Z" fill="#37c2b1" />
  <path d="M2.81,6.89H15.18a.27.27,0,0,1,.26.27v1.4a.27.27,0,0,1-.26.27H2.81a.27.27,0,0,1-.26-.27V7.16A.27.27,0,0,1,2.81,6.89Z" fill="#fff" />
  <path d="M2.82,9.68H15.19a.27.27,0,0,1,.26.27v1.41a.27.27,0,0,1-.26.27H2.82a.27.27,0,0,1-.26-.27V10A.27.27,0,0,1,2.82,9.68Z" fill="#37c2b1" />
  <path d="M2.82,12.5H15.19a.27.27,0,0,1,.26.27v1.41a.27.27,0,0,1-.26.27H2.82a.27.27,0,0,1-.26-.27V12.77A.27.27,0,0,1,2.82,12.5Z" fill="#258277" />
</svg>
`,blob:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <defs>
    <linearGradient id="aa32ebca-eeba-4b3a-9ee4-7e15a794a5d5" x1="9" y1="15.799" x2="9" y2="5.316" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#32bedd" />
      <stop offset="0.775" stop-color="#32d4f5" />
    </linearGradient>
  </defs>
  <g id="a9342976-9512-4674-89f1-52a588cf420b">
    <g>
      <path d="M.544,5.316H17.456a0,0,0,0,1,0,0v9.918a.565.565,0,0,1-.565.565H1.109a.565.565,0,0,1-.565-.565V5.316A0,0,0,0,1,.544,5.316Z" fill="url(#aa32ebca-eeba-4b3a-9ee4-7e15a794a5d5)" />
      <path d="M1.112,2.2H16.888a.565.565,0,0,1,.565.565v2.55a0,0,0,0,1,0,0H.547a0,0,0,0,1,0,0V2.766A.565.565,0,0,1,1.112,2.2Z" fill="#0078d4" />
      <path d="M13.528,7.347H9.384A.228.228,0,0,1,9.26,7.31L8.077,6.523a.218.218,0,0,0-.123-.038H4.472a.222.222,0,0,0-.222.222v7.315a.221.221,0,0,0,.222.222h9.056a.221.221,0,0,0,.222-.222V7.569A.222.222,0,0,0,13.528,7.347Z" fill="#f78d1e" />
      <rect x="5.114" y="6.91" width="2.159" height="0.432" rx="0.091" fill="#fff" />
      <rect x="5.114" y="6.91" width="0.432" height="0.432" rx="0.062" fill="#d15900" />
      <path d="M13.528,7.337H8.977A.219.219,0,0,0,8.82,7.4l-.732.731a.22.22,0,0,1-.157.066H4.472a.221.221,0,0,0-.222.221v5.591a.221.221,0,0,0,.222.222h9.056a.221.221,0,0,0,.222-.222V7.558A.221.221,0,0,0,13.528,7.337Z" fill="#fff" />
    </g>
  </g>
</svg>
`,file:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">\r
  <defs>\r
    <linearGradient id="ba3d4428-273b-47d2-80ac-53671019b795" x1="-1267.23" y1="3.07" x2="-1267.52" y2="14.64" gradientTransform="matrix(-1, 0, 0, 1, -1256.13, 0)" gradientUnits="userSpaceOnUse">\r
      <stop offset="0" stop-color="#32d4f5" />\r
      <stop offset="0.23" stop-color="#31d0f1" />\r
      <stop offset="0.46" stop-color="#2cc3e6" />\r
      <stop offset="0.7" stop-color="#25afd4" />\r
      <stop offset="0.94" stop-color="#1c92ba" />\r
      <stop offset="1" stop-color="#198ab3" />\r
    </linearGradient>\r
  </defs>\r
  <g id="bce83c25-9afe-4c01-b0b0-4312ccacb0c8">\r
    <g>\r
      <path d="M17.28,3.9h-.91a4.16,4.16,0,0,0-.55,0,.68.68,0,0,1-.59-1l.39-.7a1.83,1.83,0,0,0-.51-.29l-.93,1.66a.7.7,0,0,1-.6.35h-.83a.66.66,0,0,0-.32.08h0L10.86,5a.25.25,0,0,1-.16,0H5.27A.29.29,0,0,0,5,5.32v4.82l-1.75.54.13.56L5,11V13.9a.29.29,0,0,0,.29.29h9.37l1.15,1.49.49-.31-.68-1.18h1.68a.29.29,0,0,0,.3-.29V4.2A.3.3,0,0,0,17.28,3.9Z" fill="#005ba1" />\r
      <circle cx="15.88" cy="1.08" r="1.09" fill="#50e5ff" />\r
      <circle cx="16.58" cy="16.59" r="1.42" fill="#50e5ff" />\r
      <circle cx="1.77" cy="11.44" r="1.77" fill="#50e5ff" />\r
      <g>\r
        <path d="M15.17,4.75l-6.91-1H8.12a1,1,0,0,0-1,.87L6.86,6.31H16L16,5.9A1,1,0,0,0,15.17,4.75Z" fill="#0078d4" />\r
        <path d="M15.1,5.18l-6.9-1H8.11a.58.58,0,0,0-.57.5L7.3,6.31h8.22l.07-.47A.58.58,0,0,0,15.1,5.18Z" fill="#fff" />\r
      </g>\r
      <path d="M5.26,5h6.05a.33.33,0,0,1,.21.09l1,1a.29.29,0,0,0,.21.09h4.6a.3.3,0,0,1,.3.29V13.9a.3.3,0,0,1-.3.29h-12A.29.29,0,0,1,5,13.9V5.32A.3.3,0,0,1,5.26,5Z" fill="url(#ba3d4428-273b-47d2-80ac-53671019b795)" />\r
    </g>\r
  </g>\r
</svg>\r
`,queue:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <defs>
    <linearGradient id="f6607f9a-6e3a-4339-acc9-d6f3ae1a2c0d" x1="9" y1="15.799" x2="9" y2="5.316" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#a67af4" />
      <stop offset="0.775" stop-color="#b796f9" />
    </linearGradient>
  </defs>
  <g id="f3784f80-3379-4e66-8e32-fca3fab0f4d7">
    <g>
      <path d="M.544,5.316H17.456a0,0,0,0,1,0,0v9.918a.565.565,0,0,1-.565.565H1.109a.565.565,0,0,1-.565-.565V5.316A0,0,0,0,1,.544,5.316Z" fill="url(#f6607f9a-6e3a-4339-acc9-d6f3ae1a2c0d)" />
      <path d="M1.112,2.2H16.888a.565.565,0,0,1,.565.565v2.55a0,0,0,0,1,0,0H.547a0,0,0,0,1,0,0V2.766A.565.565,0,0,1,1.112,2.2Z" fill="#773adc" />
      <g>
        <rect x="2.625" y="6.435" width="3.683" height="7.933" rx="0.274" fill="#fff" />
        <rect x="7.158" y="6.435" width="3.683" height="7.933" rx="0.274" fill="#fff" opacity="0.75" />
        <rect x="11.692" y="6.435" width="3.683" height="7.933" rx="0.274" fill="#fff" opacity="0.5" />
      </g>
    </g>
  </g>
</svg>
`,table:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <defs>
    <linearGradient id="fc742b2b-5750-4864-b8dc-cdccaac6f13c" x1="9" y1="15.834" x2="9" y2="5.788" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0078d4" />
      <stop offset="0.502" stop-color="#4093e6" />
      <stop offset="0.775" stop-color="#5ea0ef" />
    </linearGradient>
  </defs>
  <g id="fb33f902-6783-4db3-88ea-a4524e356c77">
    <g>
      <path d="M.5,5.788h17a0,0,0,0,1,0,0v9.478a.568.568,0,0,1-.568.568H1.068A.568.568,0,0,1,.5,15.266V5.788A0,0,0,0,1,.5,5.788Z" fill="url(#fc742b2b-5750-4864-b8dc-cdccaac6f13c)" />
      <path d="M1.071,2.166H16.929a.568.568,0,0,1,.568.568V5.788a0,0,0,0,1,0,0H.5a0,0,0,0,1,0,0V2.734A.568.568,0,0,1,1.071,2.166Z" fill="#0078d4" />
      <rect x="2.304" y="7.121" width="3.65" height="1.85" rx="0.283" fill="#fff" opacity="0.9" />
      <rect x="7.2" y="7.095" width="3.65" height="1.85" rx="0.283" fill="#fff" opacity="0.9" />
      <rect x="12.096" y="7.095" width="3.65" height="1.85" rx="0.283" fill="#fff" opacity="0.9" />
      <rect x="2.358" y="9.767" width="3.65" height="1.85" rx="0.283" fill="#fff" opacity="0.9" />
      <rect x="7.254" y="9.741" width="3.65" height="1.85" rx="0.283" fill="#ffd400" />
      <rect x="12.15" y="9.741" width="3.65" height="1.85" rx="0.283" fill="#ffd400" />
      <rect x="2.358" y="12.439" width="3.65" height="1.85" rx="0.283" fill="#ffd400" />
      <rect x="7.254" y="12.413" width="3.65" height="1.85" rx="0.283" fill="#ffd400" />
      <rect x="12.15" y="12.413" width="3.65" height="1.85" rx="0.283" fill="#ffd400" />
    </g>
  </g>
</svg>
`,sub:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <defs>
    <radialGradient id="a445c717-9d75-44c7-ba6b-0d8f2383e560" cx="-36.63" cy="17.12" r="11.18" gradientTransform="translate(41.88 -7.4) scale(0.94 0.94)" gradientUnits="userSpaceOnUse">
      <stop offset="0.27" stop-color="#ffd70f" />
      <stop offset="0.49" stop-color="#ffcb12" />
      <stop offset="0.88" stop-color="#feac19" />
      <stop offset="1" stop-color="#fea11b" />
    </radialGradient>
  </defs>
  <path id="e3d1e58c-f78e-4fb5-9857-0c9331da9979" d="M13.56,7.19a2.07,2.07,0,0,0,0-2.93h0L10,.69a2.06,2.06,0,0,0-2.92,0h0L3.52,4.26a2.09,2.09,0,0,0,0,2.93l3,3a.61.61,0,0,1,.17.41v5.52a.7.7,0,0,0,.2.5l1.35,1.35a.45.45,0,0,0,.66,0l1.31-1.31h0l.77-.77a.26.26,0,0,0,0-.38l-.55-.56a.29.29,0,0,1,0-.42l.55-.56a.26.26,0,0,0,0-.38L10.4,13a.28.28,0,0,1,0-.41L11,12a.26.26,0,0,0,0-.38l-.77-.78v-.28Zm-5-5.64A1.18,1.18,0,1,1,7.37,2.73,1.17,1.17,0,0,1,8.54,1.55Z" fill="url(#a445c717-9d75-44c7-ba6b-0d8f2383e560)" />
  <path id="a21a8f7a-61cc-4035-8449-e5c8fe4d4d5e" d="M7.62,16.21h0A.25.25,0,0,0,8,16V11.55a.27.27,0,0,0-.11-.22h0a.25.25,0,0,0-.39.22V16A.27.27,0,0,0,7.62,16.21Z" fill="#ff9300" opacity="0.75" />
  <rect id="ecd3189c-fb1e-4a0e-a2b6-ba2f11dda484" x="5.69" y="5.45" width="5.86" height="0.69" rx="0.32" fill="#ff9300" opacity="0.75" />
  <rect id="a1949a3c-4818-4bd1-b236-0d970b92fc62" x="5.69" y="6.57" width="5.86" height="0.69" rx="0.32" fill="#ff9300" opacity="0.75" />
</svg>
`};var UI_ICONS={add:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>`,clear:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 5l14 14M19 5 5 19"/>
  </svg>`,check:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m5 12 4 4L19 6"/>
  </svg>`,warning:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3 10 18H2zM12 9v5M12 17v.1"/>
  </svg>`,insight:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18h6M9 21h6M8 15a7 7 0 1 1 8 0l-1 3H9z"/>
  </svg>`,sort:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 4v16m-3-3 3 3 3-3M12 6h9M12 12h6M12 18h3"/>
  </svg>`,select:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16v16H4zM7 12l3 3 7-7"/>
  </svg>`,send:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 3 18 9-18 9 4-9zM7 12h14"/>
  </svg>`,stop:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 6h12v12H6z"/>
  </svg>`,busy:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 12a8 8 0 1 1-8-8"/>
  </svg>`,refresh:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 7v5h-5M20 12a8 8 0 1 0-2 5"/>
  </svg>`,download:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>
  </svg>`,upload:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 16V4m-4 4 4-4 4 4M4 17v4h16v-4"/>
  </svg>`,trash:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/>
  </svg>`,link:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m9 15 6-6M8 12l-2 2a3 3 0 0 0 4 4l2-2M16 12l2-2a3 3 0 0 0-4-4l-2 2"/>
  </svg>`,edit:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m4 16 12-12 4 4-12 12-5 1z"/>
  </svg>`,folder:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 7h7l2 2h9v11H3zM3 7V4h7l2 3"/>
  </svg>`,file:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 3h8l4 4v14H6zM14 3v5h4"/>
  </svg>`,back:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m14 5-7 7 7 7"/>
  </svg>`,forward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m9 5 7 7-7 7"/>
  </svg>`,down:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>`,first:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 5v14M18 5l-7 7 7 7"/>
  </svg>`,last:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 5v14M6 5l7 7-7 7"/>
  </svg>`,collapse:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3.5 3.5 8 8 12.5M13 3.5 8.5 8 13 12.5"/>
  </svg>`,expand:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3.5 12.5 8 8 12.5M3 3.5 7.5 8 3 12.5"/>
  </svg>`,pin:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
  </svg>`,open:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 4H4v16h16v-5M14 4h6v6M20 4 10 14"/>
  </svg>`,move:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 12h18m-6-6 6 6-6 6"/>
  </svg>`,transfer:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 8h13l-3-3M20 16H7l3 3"/>
  </svg>`,plan:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 7h16M4 12h16M4 17h10"/>
  </svg>`,filter:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 5h16l-6 7v6l-4 2v-8z"/>
  </svg>`,archive:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 4h18v5H3zM5 9v11h14V9M9 13h6"/>
  </svg>`,list:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>`,lock:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 10h14v11H5zM8 10V7a4 4 0 0 1 8 0v3"/>
  </svg>`,policy:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3 9 3v5c0 5-4 8-9 11-5-3-9-6-9-11V6z"/>
  </svg>`,terminal:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 4h18v16H3zM6 9l3 3-3 3M12 15h6"/>
  </svg>`,copy:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 8h13v13H8zM16 8V3H3v13h5"/>
  </svg>`,explorer:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" stroke="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <defs>
    <linearGradient id="seIconGrad" x1="9.286" y1="7.103" x2="8.876" y2="19.415" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#e6e6e6"/>
    <stop offset="1" stop-color="#b3b3b3"/>
    </linearGradient>
    </defs>
    <path d="M16.218,6.589H11.293a.259.259,0,0,0-.259.259V9.829a.259.259,0,0,1-.259.259H6.406a.257.257,0,0,0-.257.257v3.043a.26.26,0,0,1-.26.259H1.521a.258.258,0,0,0-.258.257v3.581A.516.516,0,0,0,1.778,18h9.816a.233.233,0,0,0,.053-.006h4.571a.518.518,0,0,0,.519-.518V7.107A.518.518,0,0,0,16.218,6.589Z" fill="url(#seIconGrad)"/>
    <rect x="11.851" y="14.495" width="4.068" height="2.711" rx="0.259" fill="#005ba1"/>
    <rect x="11.851" y="10.936" width="4.068" height="2.711" rx="0.259" fill="#5ea0ef"/>
    <rect x="11.851" y="7.377" width="4.068" height="2.711" rx="0.259" fill="#fff"/>
    <rect x="6.966" y="14.5" width="4.068" height="2.711" rx="0.259" fill="#005ba1"/>
    <rect x="6.966" y="10.942" width="4.068" height="2.711" rx="0.259" fill="#fff"/>
    <rect x="2.081" y="14.5" width="4.068" height="2.711" rx="0.259" fill="#005ba1"/>
    <rect x="6.097" y="3.396" width="4.834" height="3.221" rx="0.308" fill="#5ea0ef"/>
    <rect x="1.263" y="6.76" width="4.834" height="3.221" rx="0.308" fill="#0078d4"/>
    <rect x="1.263" width="4.834" height="3.221" rx="0.308" fill="#83b9f9"/>
  </svg>`,search:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="6.8" cy="6.8" r="4.3"/>
    <path d="M13 13 9.9 9.9"/>
  </svg>`,more:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="5" cy="12" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="19" cy="12" r="1.5"/>
  </svg>`,read:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1.4 8S3.9 3.6 8 3.6 14.6 8 14.6 8 12.1 12.4 8 12.4 1.4 8 1.4 8Z"/>
    <circle cx="8" cy="8" r="2.1"/>
  </svg>`,info:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="8" r="6.4"/>
    <path d="M8 7.4v3.4M8 5.2h.01"/>
  </svg>`,statistics:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="12" width="4.2" height="8" rx="1.3"/>
    <rect x="9.9" y="7" width="4.2" height="13" rx="1.3"/>
    <rect x="16.8" y="3" width="4.2" height="17" rx="1.3"/>
  </svg>`};function uiIcon(name,options={}){let icon=UI_ICONS[name];if(!icon)throw new Error("Unknown Storage icon: "+name);let size=options.size||16,attributes=' data-icon="'+name+'" width="'+size+'" height="'+size+'"'+(options.className?' class="'+options.className+'"':"")+(options.style?' style="'+options.style+'"':"");return icon.replace("<svg ","<svg"+attributes+' aria-hidden="true" ')}var CSS=`
:root{
  color-scheme:dark;
  /* Fluent 2 dark is the default tone. When the GitHub Copilot app delivers its
     semantic theme tokens they win through the var() fallbacks; the light override
     and the OS-preference fallback below cover light mode. */
  --bg:var(--background-color-default,#0b0b0b);--bg-2:#141414;
  --panel:#1a1a1a;--surface:#1f1f1f;--surface-2:#242424;--surface-3:#2e2e2e;
  --stroke:var(--border-color-default,#333333);--stroke-2:#424242;
  --text:var(--text-color-default,#ffffff);--text-2:#d6d6d6;--text-3:var(--text-color-muted,#a6a6a6);
  --azure:#479ef5;--azure-2:#62abf5;--cyan:#62abf5;
  --accent:#479ef5;--accent-2:#62abf5;--accent-soft:rgba(71,158,245,.12);--sel:rgba(71,158,245,.16);
  --brand:#0f6cbd;--brand-hover:#115ea3;--brand-press:#0c3b5e;
  --on-accent:#04121f;--code-bg:#0b0e14;--code-text:#cbd5e1;
  --glow:0 0 0 2px rgba(71,158,245,.35);
  --grad:linear-gradient(135deg,#0f6cbd,#2886de);
  --grad-soft:rgba(71,158,245,.10);
  --ok:#6ccb5f;--warn:#f2c661;--bad:#f1707b;
  --shadow:0 4px 14px rgba(0,0,0,.4);
  --radius:8px;
}
/* Follow the host (GitHub Copilot app) theme. A valid data-theme-tone wins; a
   missing or invalid tone falls back to data-color-mode; OS preference is the last
   resort. The host updates these attributes live, so the canvas re-themes with no
   reload, no sign-in, and no Azure requery. */
:root[data-theme-tone="dark"],
:root:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="dark"]{color-scheme:dark}
:root[data-theme-tone="light"],
:root:not([data-theme-tone="light"]):not([data-theme-tone="dark"])[data-color-mode="light"]{
  color-scheme:light;
  --bg:var(--background-color-default,#ffffff);
  --stroke:var(--border-color-default,#d0d7de);
  --text:var(--text-color-default,#1f2328);--text-3:var(--text-color-muted,#656d76);
  --azure:#0b6bcb;
  --shadow:0 4px 14px rgba(140,149,159,.2);
}
@media (prefers-color-scheme: light){
  :root:not([data-color-mode]):not([data-theme-tone]){
    color-scheme:light;
    --bg:var(--background-color-default,#ffffff);
    --stroke:var(--border-color-default,#d0d7de);
    --text:var(--text-color-default,#1f2328);--text-3:var(--text-color-muted,#656d76);
    --azure:#0b6bcb;
    --shadow:0 4px 14px rgba(140,149,159,.2);
  }
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;font:13px/1.5 -apple-system,"Segoe UI",Roboto,system-ui,Helvetica,Arial,sans-serif;
  color:var(--text);-webkit-font-smoothing:antialiased;
  background:linear-gradient(180deg,var(--bg-2),var(--bg))}
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-thumb{background:var(--stroke-2);border-radius:999px;border:2px solid transparent;background-clip:padding-box}
::-webkit-scrollbar-thumb:hover{background:var(--accent);background-clip:padding-box}
::-webkit-scrollbar-track{background:transparent}

/* signature brand hairline at the very top */
body::before{content:"";position:fixed;top:0;left:0;right:0;height:2px;background:var(--brand);z-index:50}

.appbar{display:flex;align-items:center;gap:8px;padding:8px 16px;border-bottom:1px solid var(--stroke);
  background:var(--panel);position:sticky;top:0;z-index:20}
.appbar .logo{width:24px;height:24px;display:grid;place-items:center;flex:none}
.appbar .logo svg,.appbar .logo img{width:24px;height:24px;display:block}
.appbar .sub{font-size:11px;color:var(--text-3);margin-left:2px}
.appbar h1{font-size:15.5px;margin:0;font-weight:600;letter-spacing:.2px;color:var(--text)}
.appbar .spacer{flex:1}
.appbar .seopen{display:inline-flex;align-items:center;gap:6px;cursor:pointer;background:transparent;border:1px solid var(--stroke-2);color:var(--text-3);font-size:12px;font-weight:500;border-radius:999px;padding:5px 7px;white-space:nowrap;transition:background .12s ease,border-color .12s ease,color .12s ease}
.appbar .seopen:hover{background:var(--surface-2);border-color:var(--stroke-2);color:var(--text-2)}
.appbar .seopen .seopen-lbl{display:none}
.appbar .seopen.on .seopen-lbl{display:inline}
.appbar .seopen.on{color:var(--text-2);border-color:var(--stroke-2);background:var(--surface);padding:5px 13px 5px 10px}
.appbar .seopen.on:hover{background:var(--surface-2);border-color:var(--text);color:var(--text)}
.appbar .seopen:active{transform:translateY(.5px)}
.appbar .seopen svg{width:15px;height:15px;flex:none}
.appbar .seopen:disabled{opacity:.6;cursor:default}
/* Contextual hand-off strip: appears only where the canvas hits its limits */
.secta{display:flex;align-items:center;gap:12px;margin-top:14px;padding:11px 13px;border:1px solid var(--stroke-2);border-radius:12px;background:var(--surface-2)}
.secta-ic{flex:none;display:inline-flex}
.secta-tx{display:flex;flex-direction:column;gap:2px;min-width:0}
.secta-tx b{font-size:12.5px;color:var(--text-1);font-weight:600}
.secta-tx span{font-size:11.5px;color:var(--text-3);line-height:1.45}
.secta-btn{margin-left:auto;flex:none;display:inline-flex;align-items:center;gap:7px;cursor:pointer;background:var(--surface-3,var(--text));border:1px solid var(--stroke-2);color:var(--text-1);font-size:12px;font-weight:600;border-radius:999px;padding:7px 14px 7px 11px;white-space:nowrap;transition:background .12s ease,border-color .12s ease}
.secta-btn:hover{background:var(--sel);border-color:color-mix(in srgb,var(--accent) 50%,transparent)}
.secta-btn:active{transform:translateY(.5px)}
.secta-btn svg{flex:none}
.ctx{display:flex;align-items:center;gap:8px;margin-left:8px;padding-left:16px;border-left:1px solid var(--stroke);min-width:0;overflow:hidden}
.ctx-none{font-size:12px;color:var(--text-3);font-style:italic}
.cx{display:inline-flex;align-items:center;gap:6px;min-width:0;font-size:13px;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cx.strong{color:var(--text);font-weight:600;max-width:240px}
.cx-i{display:inline-flex;flex:none;opacity:.85}
.cx-i svg{width:14px;height:14px}
.cx-sep{color:var(--text-3);opacity:.5;font-size:15px;line-height:1;flex:none}
@media(max-width:900px){.cx.strong{max-width:130px}}
.chip{font-size:10.5px;color:var(--text-2);border:1px solid var(--stroke-2);border-radius:999px;padding:3px 10px;
  background:var(--surface);white-space:nowrap}
.chip.accent{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 45%,transparent);background:var(--accent-soft)}
.chip.warn{color:var(--bad);border-color:color-mix(in srgb,var(--bad) 40%,transparent);background:color-mix(in srgb,var(--bad) 10%,transparent)}

.shell{display:grid;grid-template-columns:320px 1fr;gap:0;height:calc(100vh - 56px);min-height:0}
.shell.collapsed{grid-template-columns:54px 1fr}
.side{border-right:1px solid var(--stroke);background:var(--bg-2);display:flex;flex-direction:column;min-height:0;overflow:hidden}
.main{overflow-y:auto;padding:8px 16px 70px}
.mainwrap{max-width:1080px;margin:0 auto}

.side-head{display:flex;align-items:center;gap:10px;padding:13px 12px;border-bottom:1px solid var(--stroke);min-height:56px;box-sizing:border-box}
.side-head .t{font-size:14px;font-weight:600;letter-spacing:.2px;color:var(--text)}
.side-head .head-ico{flex:none;display:grid;place-items:center}
.side-head .head-ico svg{width:30px;height:30px;display:block}
.iconbtn{cursor:pointer;background:transparent;border:1px solid transparent;border-radius:8px;color:var(--text-2);
  width:28px;height:28px;display:grid;place-items:center;font-size:14px;transition:.12s}
.iconbtn:hover{background:var(--surface-2);color:var(--cyan);border-color:var(--stroke-2)}
#sideToggle{padding:0}
#sideToggle svg{width:17px;height:17px;display:block}
#refreshBtn svg{width:16px;height:16px;display:block}
.side.collapsed .side-head .t,.side.collapsed .side-body,.side.collapsed .side-tools,.side.collapsed .side-head .head-ico{display:none}
.side.collapsed .side-head{justify-content:center;padding:13px 0}
.side.collapsed #refreshBtn{display:none}
/* collapsed vertical icon rail (Azure DevOps style) */
.side-rail{display:none}
.side.collapsed .side-rail{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0;overflow-y:auto}
.railbtn{width:36px;height:36px;border-radius:8px;display:grid;place-items:center;cursor:pointer;background:transparent;border:1px solid transparent;position:relative}
.railbtn:hover{background:var(--surface-2);border-color:var(--stroke-2)}
.railbtn .svi{width:19px;height:19px}
.railbtn .rk{font-size:16px;line-height:1}
.railbtn .rk svg{width:16px;height:16px;display:block}
.rail-sep{width:22px;height:1px;background:var(--stroke);margin:5px 0;flex:none}
.side-tools{padding:6px 8px;border-bottom:1px solid var(--stroke)}
.side-heading{display:flex;align-items:center;flex-wrap:wrap;gap:4px;flex:1;min-width:0}
.side-heading .chip{padding:1px 6px;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.side.collapsed .side-heading{display:none}
.side-toolbar{display:flex;align-items:center;gap:6px;margin-top:6px}
.side-toolbar .iconbtn{padding:4px}
.side-body{flex:1;overflow-y:auto;padding:8px 6px 20px}

.search{position:relative}
.search input{width:100%;background:var(--surface);border:1px solid var(--stroke-2);border-radius:10px;
  padding:6px 10px 6px 32px;color:var(--text);font-family:inherit;font-size:12.5px;line-height:18px;outline:none;transition:.12s}
.search input:focus{border-color:var(--accent);box-shadow:var(--glow)}
.search .mag{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--accent);display:flex;align-items:center;pointer-events:none}
.search .mag svg{width:15px;height:15px;display:block}
.search:focus-within .mag{color:var(--brand)}

.tree{font-size:13px}
.tnode{user-select:none}
.trow{position:relative;display:flex;align-items:center;gap:7px;padding:6px 9px;border-radius:9px;cursor:pointer;white-space:nowrap;overflow:hidden;transition:.1s}
.trow:hover{background:var(--surface-2)}
.trow.sel{background:var(--sel);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 45%,transparent)}
.trow.sel::before{content:"";position:absolute;left:0;top:4px;bottom:4px;width:3px;border-radius:999px;background:var(--grad)}
.tw{width:14px;text-align:center;color:var(--text-3);font-size:10px;transition:transform .15s;flex:none}
.tw.open{transform:rotate(90deg)}
.ti{width:18px;display:inline-flex;align-items:center;justify-content:center;flex:none;font-size:13px}
.svi{width:15px;height:15px;display:block;flex:none;object-fit:contain}
.trow .svi{opacity:.92}
.tlabel{overflow:hidden;text-overflow:ellipsis}
.tmeta{margin-left:auto;color:var(--text-3);font-size:10px;flex:none;padding-left:8px;background:var(--surface-2);border-radius:999px;padding:1px 8px}
.tchildren{margin-left:15px;border-left:1px solid var(--stroke-2);padding-left:5px}
.tempty{color:var(--text-3);font-size:12px;padding:6px 10px;font-style:italic}
.tspin{color:var(--text-2);font-size:12px;padding:6px 10px;display:flex;align-items:center;gap:7px}

.card{background:var(--surface);border:1px solid var(--stroke);
  border-radius:var(--radius);margin-bottom:15px;box-shadow:var(--shadow);overflow:hidden;position:relative;transition:border-color .15s}
.card:hover{border-color:var(--stroke-2)}
.card-head{display:flex;align-items:center;gap:10px;padding:13px 16px;cursor:pointer}
.card-head h2{font-size:14px;margin:0;font-weight:640;display:flex;align-items:center;gap:8px}
.hdr-acct{color:var(--text-2);font-weight:560}
.hdr-sep{color:var(--text-2);opacity:.6;margin:0 2px;font-weight:400}
.hdr-item{color:var(--text);font-weight:680}
.card-head .badge{font-size:10px;color:var(--text-2);border:1px solid var(--stroke-2);border-radius:999px;padding:2px 10px;font-weight:500;background:var(--surface-2)}
.card-head .badge:empty{display:none}
.card-head .cw{margin-left:auto;color:var(--text-3);width:32px;height:32px;display:grid;place-items:center;flex:none;transition:transform .15s}
.card-head .cw svg{width:20px;height:20px;display:block}
.card-sub{margin:-4px 0 13px;font-size:12px;color:var(--text-3);line-height:1.5}
.xdesthint{font-size:11.5px;color:var(--text-3);margin-top:6px;line-height:1.5}
.xsrc{display:flex;align-items:center;gap:10px;padding:10px 14px;margin-bottom:14px;border-radius:9px;font-size:12.5px}
.xsrc.on{background:color-mix(in srgb,var(--accent) 7%,transparent);border:1px solid color-mix(in srgb,var(--accent) 28%,transparent);color:var(--text-2)}
.xsrc.off{background:var(--surface-2);border:1px dashed var(--stroke-2);color:var(--text-3)}
.xsrc-lbl{font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--text-3)}
.xsrc-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:7px;background:var(--surface-2);border:1px solid var(--stroke-2);font-size:13px;font-weight:600;color:var(--text)}
.xsrc-chip svg{color:var(--accent)}
.xsrc-acct{color:var(--text-2);font-weight:500}
.xsrc-sep{color:var(--text-3);margin:0 1px}
.xsrc-cnt{margin-left:auto;font-size:11.5px;color:var(--text-3);font-weight:500}
.xsrc-ic{display:inline-flex;color:var(--text-3)}
.xsrc.off .xsrc-ic svg{color:var(--text-3)}
.xdesthint code{background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:4px;padding:1px 5px;color:var(--text-2);font-size:11px}
.xerr{display:flex;gap:11px;align-items:flex-start;padding:13px 15px;border-radius:9px;background:color-mix(in srgb,var(--bad) 10%,transparent);border:1px solid color-mix(in srgb,var(--bad) 42%,transparent)}
.xerr-ic{color:var(--bad);font-size:16px;line-height:1.2;flex:0 0 auto}
.xerr b{font-size:13px;color:var(--text)}
.xerr-msg{font-size:12.5px;color:var(--text-2);margin-top:3px;line-height:1.5}
/* Transfer plan \u2014 Fluent/Portal-style result */
.xplan{background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 6%,transparent),color-mix(in srgb,var(--accent) 0%,transparent));border:1px solid var(--stroke-2);border-radius:12px;padding:16px 18px}
.xroute{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.xep{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:8px;background:var(--surface-2);border:1px solid var(--stroke-2);font-size:13px;font-weight:600;color:var(--text);max-width:100%}
.xep-t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.xep-src .xep-ic{color:var(--accent)}
.xep-dst .xep-ic{color:var(--accent)}
.xarrow{color:var(--text-3);display:inline-flex;flex:0 0 auto}
.xpolicy{display:inline-flex;align-items:center;font-size:11px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;padding:4px 10px;border-radius:999px;margin-left:auto;border:1px solid transparent}
.xpol-overwrite{background:color-mix(in srgb,var(--bad) 14%,transparent);border-color:color-mix(in srgb,var(--bad) 40%,transparent);color:var(--bad)}
.xpol-skip{background:color-mix(in srgb,var(--text) 14%,transparent);border-color:var(--stroke-2);color:var(--text-2)}
.xpol-if-newer{background:color-mix(in srgb,var(--accent) 14%,transparent);border-color:color-mix(in srgb,var(--accent) 40%,transparent);color:var(--accent)}
.xmetrics{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;margin-top:16px;background:var(--stroke-2);border:1px solid var(--stroke-2);border-radius:10px;overflow:hidden}
.xmetric{background:var(--surface-2);padding:14px 12px;text-align:center;position:relative}
.xm-v{font-size:22px;font-weight:700;color:var(--text);line-height:1.1;letter-spacing:-.01em}
.xm-l{font-size:11px;color:var(--text-3);margin-top:5px;text-transform:uppercase;letter-spacing:.04em}
.xm-accent{box-shadow:inset 3px 0 0 var(--accent)}
.xm-accent .xm-v{color:var(--accent)}
.xm-ok .xm-v{color:var(--ok)}
.xm-warn{box-shadow:inset 3px 0 0 var(--bad)}
.xm-warn .xm-v{color:var(--bad)}
.xsub{margin-top:12px;font-size:12px;color:var(--text-3)}
.xexplain{display:flex;gap:9px;align-items:flex-start;margin-top:12px;padding:11px 13px;border-radius:9px;font-size:12.5px;line-height:1.55;color:var(--text-2)}
.xexplain svg{flex:0 0 auto;margin-top:1px}
.xexplain b{color:var(--text)}
.pe-ow{background:color-mix(in srgb,var(--bad) 8%,transparent);border:1px solid color-mix(in srgb,var(--bad) 30%,transparent)}
.pe-ow svg{color:var(--bad)}
.pe-skip{background:color-mix(in srgb,var(--text) 8%,transparent);border:1px solid var(--stroke-2)}
.pe-skip svg{color:var(--text-3)}
.pe-ifn{background:color-mix(in srgb,var(--accent) 8%,transparent);border:1px solid color-mix(in srgb,var(--accent) 30%,transparent)}
.pe-ifn svg{color:var(--accent)}
.xact{display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:2px 9px;border-radius:6px}
.act-ow{background:color-mix(in srgb,var(--bad) 16%,transparent);color:var(--bad)}
.act-skip{background:color-mix(in srgb,var(--text) 14%,transparent);color:var(--text-3)}
.act-ifn{background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent)}
.xsub .xdot{margin:0 6px;color:var(--stroke-2)}
.xconf{margin-top:14px;border:1px solid var(--stroke-2);border-radius:10px;overflow:hidden}
.xconf-h{padding:10px 14px;font-size:12.5px;color:var(--text-2);background:color-mix(in srgb,var(--bad) 6%,transparent);border-bottom:1px solid var(--stroke-2)}
.xconf-badge{display:inline-flex;min-width:20px;height:20px;align-items:center;justify-content:center;padding:0 6px;border-radius:6px;background:color-mix(in srgb,var(--bad) 20%,transparent);color:var(--bad);font-weight:700;font-size:12px;margin-right:6px}
.xtbl{width:100%;border-collapse:collapse;font-size:12.5px}
.xtbl th{text-align:left;padding:8px 14px;color:var(--text-3);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.03em;background:var(--surface-2)}
.xtbl td{padding:8px 14px;border-top:1px solid var(--stroke-2);color:var(--text-2)}
.xcmd-card{margin-top:16px;border:1px solid var(--stroke-2);border-radius:10px;overflow:hidden;background:var(--panel)}
.xcmd-head{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--surface-2);border-bottom:1px solid var(--stroke-2)}
.xcmd-title{display:inline-flex;align-items:center;font-size:12.5px;font-weight:600;color:var(--text-2)}
.xchip{display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:3px 9px;border-radius:999px;border:1px solid transparent}
.xchip-ok{background:color-mix(in srgb,var(--ok) 13%,transparent);border-color:color-mix(in srgb,var(--ok) 38%,transparent);color:var(--ok)}
.xchip-warn{background:color-mix(in srgb,var(--bad) 14%,transparent);border-color:color-mix(in srgb,var(--bad) 42%,transparent);color:var(--bad)}
.xcopy{margin-left:auto;display:inline-flex;align-items:center;background:var(--accent);color:var(--on-accent);border:none;border-radius:7px;padding:6px 13px;font-size:12px;font-weight:600;cursor:pointer;transition:filter .12s}
.xcopy:hover{filter:brightness(1.08)}
.xcmd{margin:0;padding:14px;font-family:ui-monospace,Consolas,monospace;font-size:12.5px;line-height:1.6;color:var(--code-text);white-space:pre-wrap;word-break:break-all;background:var(--code-bg)}
.xnote{display:flex;gap:9px;align-items:flex-start;padding:11px 14px;font-size:12px;color:var(--text-3);line-height:1.55;border-top:1px solid var(--stroke-2);background:var(--surface-2)}
.xnote code{background:var(--surface);border:1px solid var(--stroke-2);border-radius:4px;padding:1px 5px;color:var(--text-2);font-size:11.5px}
.xnote-warn{color:var(--text-2);background:color-mix(in srgb,var(--bad) 8%,transparent)}
.xnote-warn a{color:var(--cyan)}
@media(max-width:640px){.xmetrics{grid-template-columns:repeat(2,1fr)}}
.scopechip{font-size:10.5px;font-weight:600;border-radius:6px;padding:2px 8px;display:inline-flex;align-items:center;gap:5px;max-width:340px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:1.55;letter-spacing:.1px}
.scopechip.on{color:var(--text-3);background:color-mix(in srgb,var(--accent) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent) 30%,transparent)}
.scopechip.on b{color:var(--text);font-weight:650}
.scopechip.off{color:var(--text-3);background:transparent;border:1px dashed var(--stroke-2);font-weight:500}
.scopechip .sc-dot{width:5px;height:5px;border-radius:50%;background:var(--ok);flex:0 0 auto}
.scopechip .sc-sep{color:var(--text-3);font-weight:400;opacity:.65;margin:0 1px}
.statscap{font-size:12px;color:var(--text-2);margin:0 0 10px;display:flex;align-items:center;gap:7px}
.statscap b{color:var(--text)}
.statscap .sc-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);flex:0 0 auto}
.card.min .cw{transform:rotate(-90deg)}
.card-body{padding:0 16px 16px}
.card.min .card-body{display:none}

button{cursor:pointer;background:var(--surface-2);color:var(--text);border:1px solid var(--stroke-2);border-radius:8px;
  padding:7px 13px;font-size:12.5px;transition:.12s;font-weight:550}
button:hover{border-color:var(--stroke-2);color:var(--text);background:var(--surface-3)}
button.primary{background:var(--brand);border:1px solid transparent;color:var(--color-white,#fff)}
button.primary:hover{background:var(--brand-hover);color:var(--color-white,#fff)}
button.ghost{background:transparent;border:1px solid var(--stroke-2);color:var(--text-2)}
button.ghost:hover{background:var(--grad-soft);color:var(--text);border-color:var(--accent)}
button.danger-ghost{color:var(--bad);border-color:color-mix(in srgb,var(--bad) 35%,transparent)}
button.danger-ghost:hover{background:color-mix(in srgb,var(--bad) 12%,transparent);color:var(--bad);border-color:color-mix(in srgb,var(--bad) 60%,transparent)}
button.accent{background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 45%,transparent);color:var(--accent);font-weight:600}
button.accent:hover{background:color-mix(in srgb,var(--accent) 20%,transparent);color:var(--accent);border-color:var(--accent)}
button svg{vertical-align:-2px;margin-right:2px}
.cpdot{display:inline-block;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 32% 30%,var(--bad),var(--accent) 55%,var(--accent));box-shadow:0 0 6px color-mix(in srgb,var(--accent) 55%,transparent);vertical-align:-1px;margin-right:3px}
button:disabled{opacity:.5;cursor:not-allowed}
input,select{background:var(--bg-2);color:var(--text);border:1px solid var(--stroke-2);border-radius:9px;
  padding:9px 12px;font-size:12.5px;outline:none;transition:.12s}
select{appearance:none;-webkit-appearance:none;padding-right:30px;
  background-image:url("data:image/svg+xml,${encodeURIComponent(uiIcon("down",{size:12}).replace("currentColor","#a6a6a6"))}");
  background-repeat:no-repeat;background-position:right 11px center}
input:hover,select:hover{border-color:var(--stroke-2);background:var(--surface)}
input:focus,select:focus{border-color:var(--accent);box-shadow:var(--glow);background:var(--surface)}
input::placeholder{color:var(--text-3)}

.list{border:1px solid var(--stroke);border-radius:10px;overflow:hidden;max-height:360px;overflow-y:auto;background:color-mix(in srgb,var(--text) 50%,transparent)}
.row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 13px;border-bottom:1px solid var(--stroke);cursor:pointer;transition:.1s}
.row:last-child{border-bottom:none}
.row:hover{background:var(--surface-2)}
.row.sel{background:var(--grad-soft);box-shadow:inset 2px 0 0 var(--accent)}
.row .fname{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row .meta{color:var(--text-3);font-size:11px}
.muted{color:var(--text-2)}
.empty{color:var(--text-3);font-size:12.5px;padding:16px 4px;text-align:center}
.xempty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:26px 20px;background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 8%,transparent),color-mix(in srgb,var(--accent) 0%,transparent));border:1px solid var(--stroke);border-radius:14px}
.xempty .xe-ic{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),var(--accent));box-shadow:0 5px 16px color-mix(in srgb,var(--accent) 42%,transparent)}
.xempty .xe-ic svg{width:23px;height:23px}
.xempty .xe-t{font-size:14px;font-weight:650;color:var(--text)}
.xempty .xe-s{font-size:12px;color:var(--text-3);line-height:1.55;max-width:400px}
.flex{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.crumb{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--text-2);margin-bottom:12px;flex-wrap:wrap}
.crumb b{color:var(--text)}
.crumb .sep{color:var(--text-3)}

.bar{height:9px;border-radius:999px;background:var(--surface);border:1px solid var(--stroke-2);overflow:hidden;flex:1;min-width:160px}
.bar>i{display:block;height:100%;width:0;background:var(--brand);transition:width .25s}
.pill{display:inline-block;font-size:10.5px;font-weight:700;border-radius:999px;padding:2px 10px}
.pill.ok{background:color-mix(in srgb,var(--ok) 16%,transparent);color:var(--ok)}
.pill.bad{background:color-mix(in srgb,var(--bad) 16%,transparent);color:var(--bad)}
.pill.warn{background:color-mix(in srgb,var(--bad) 16%,transparent);color:var(--warn)}
.sas-banner{background:var(--surface);border:1px solid var(--stroke-2);border-radius:12px;padding:12px 14px}
.sas-tbl th{text-align:left;font-size:11px;color:var(--muted);font-weight:600;padding:4px 8px;border-bottom:1px solid var(--stroke-2)}
.sas-tbl td{padding:5px 8px;border-bottom:1px solid var(--stroke);font-size:12.5px;vertical-align:middle}
.sas-tbl td.fname{max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sas-tbl tr:hover td{background:color-mix(in srgb,var(--text) 2%,transparent)}
/* SAS connected view */
.sasconn{background:linear-gradient(160deg,color-mix(in srgb,var(--accent) 6%,transparent),color-mix(in srgb,var(--accent) 2%,transparent) 60%,transparent);border:1px solid var(--stroke-2);border-radius:14px;padding:14px 16px;box-shadow:inset 0 1px 0 color-mix(in srgb,var(--text) 3%,transparent),0 8px 24px -16px rgba(0,0,0,.7)}
.sashead{display:flex;align-items:center;gap:13px}
.sasavatar{width:40px;height:40px;border-radius:11px;flex:none;display:grid;place-items:center;background:var(--grad);box-shadow:0 4px 14px -3px color-mix(in srgb,var(--accent) 60%,transparent)}
.sasavatar .svi{width:20px;height:20px}
.sasid{flex:1;min-width:0}
.sastitle{display:flex;align-items:center;gap:8px;font-size:16.5px;line-height:1.2;overflow:hidden}
.sastitle b{font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sastitle .chev{color:var(--text-3);font-weight:400;flex:none}
.sassub{font-size:11.5px;color:var(--text-3);margin-top:3px}
.sasmeta{display:flex;align-items:center;gap:8px;flex:none}
.constatus{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,transparent);border:1px solid color-mix(in srgb,var(--ok) 38%,transparent);border-radius:999px;padding:4px 12px 4px 9px}
.livedot{width:8px;height:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 color-mix(in srgb,var(--ok) 50%,transparent);animation:lpulse 2s infinite;flex:none}
@keyframes lpulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ok) 45%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 0%,transparent)}100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ok) 0%,transparent)}}
.permrow{display:flex;align-items:center;gap:14px;margin-top:13px;padding-top:13px;border-top:1px solid var(--stroke)}
.plabel{font-size:10px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:var(--text-3);flex:none;width:78px}
.caps{display:flex;gap:8px;flex-wrap:wrap}
.cap{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;border-radius:9px;padding:6px 12px;border:1px solid var(--stroke);transition:.14s}
.cap .ci{width:15px;height:15px;display:inline-flex;flex:none}
.cap .lk{width:12px;height:12px;display:inline-flex;margin-left:1px;opacity:.7}
.cap.on{background:linear-gradient(180deg,color-mix(in srgb,var(--ok) 16%,transparent),color-mix(in srgb,var(--ok) 7%,transparent));border-color:color-mix(in srgb,var(--ok) 50%,transparent);color:var(--ok);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--text) 5%,transparent)}
.cap.on .ci{color:var(--ok)}
.cap.off{background:color-mix(in srgb,var(--text) 1.5%,transparent);color:var(--text-3);border-color:var(--stroke)}
.cap.off .ci{color:var(--text-3);opacity:.75}
.expchip{font-size:11px;font-weight:600;border-radius:999px;padding:4px 12px;border:1px solid var(--stroke-2);color:var(--text-2);background:color-mix(in srgb,var(--text) 2%,transparent)}
.expchip.warn{background:color-mix(in srgb,var(--bad) 12%,transparent);border-color:color-mix(in srgb,var(--bad) 40%,transparent);color:var(--warn)}
.expchip.bad{background:color-mix(in srgb,var(--bad) 14%,transparent);border-color:color-mix(in srgb,var(--bad) 40%,transparent);color:var(--bad)}
.sasm{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:13px}
.sasm .c{background:color-mix(in srgb,var(--text) 2.5%,transparent);border:1px solid var(--stroke);border-radius:12px;padding:11px 13px}
.sasm .c b{display:block;font-size:18px;font-weight:700;line-height:1.1;color:var(--text)}
.sasm .c span{display:block;margin-top:3px;font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:.6px;font-weight:600}
.sasact{width:40px;height:34px;padding:0;font-size:12px;line-height:0;display:inline-flex;align-items:center;justify-content:center;color:var(--text);background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:9px;transition:.12s}
.sasact:hover{color:var(--text);border-color:var(--accent);background:var(--surface-3)}
.sasact svg{width:18px;height:18px;margin:0;vertical-align:middle;stroke-width:1.85}
.sas-tbl th.acth,.sas-tbl td.acth{text-align:right;padding-right:8px}
.acthdr,.rowacts{display:inline-grid;grid-auto-flow:column;grid-auto-columns:40px;gap:12px;justify-content:end;justify-items:center;align-items:center}
.acthdr span{font-size:10px;color:var(--text-3);font-weight:700;text-transform:uppercase;letter-spacing:.4px}
.tierpill{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:var(--text-2);background:color-mix(in srgb,var(--text) 3%,transparent);border:1px solid var(--stroke-2);border-radius:999px;padding:2px 10px}
.tdot{width:7px;height:7px;border-radius:50%;flex:none}
.dlmsg{display:flex;align-items:center;gap:10px;flex-wrap:nowrap;margin-top:12px;padding:10px 12px;background:color-mix(in srgb,var(--ok) 8%,transparent);border:1px solid color-mix(in srgb,var(--ok) 28%,transparent);border-radius:10px;font-size:12.5px}
.dlmsg .ok{color:var(--ok);font-weight:600;flex:none}
.dlpath{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11.5px;color:var(--text-2);background:rgba(0,0,0,.3);padding:4px 8px;border-radius:6px;flex:1 1 auto;min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dlacts{display:inline-flex;gap:8px;flex:none}
.dlacts button{padding:5px 11px;font-size:12px;white-space:nowrap}
#sasDlAll{display:inline-flex;align-items:center;gap:6px}
#sasDlAll svg{width:16px;height:16px;margin:0}
.xradio{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--text);cursor:pointer}
.xradio input{margin:0}
.xstat{display:inline-flex;flex-direction:column;min-width:70px}
.xstat b{font-size:19px;font-weight:700;line-height:1.1;color:var(--text)}
.xstat b.warn{color:var(--warn,var(--bad))}
.xstat span{font-size:11px;color:var(--muted);margin-top:2px}
.mv{display:inline-flex;color:var(--muted)}
.pill.warn{background:color-mix(in srgb,var(--bad) 14%,transparent);border-color:color-mix(in srgb,var(--bad) 40%,transparent);color:var(--bad)}
.xcmd{background:var(--code-bg);border:1px solid var(--stroke-2);border-radius:8px;padding:10px 12px;margin-top:6px;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--code-text);white-space:pre-wrap;word-break:break-all;overflow-x:auto}

/* aligned form primitives (filter / SAS / transfer cards) */
.filterbar{background:var(--bg-2);border:1px solid var(--stroke);border-radius:14px;padding:14px 15px 13px}
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:13px 14px}
.field{display:flex;flex-direction:column;gap:6px;min-width:0}
.field>label{font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--text-3)}
.field input,.field select{width:100%;box-sizing:border-box}
.factions{display:flex;gap:10px;align-items:center;margin-top:13px;padding-top:12px;border-top:1px solid var(--stroke);flex-wrap:wrap}
.factions .grow{flex:1}
.factions button{display:inline-flex;align-items:center;gap:5px;padding:8px 15px;font-size:12.5px}
.hicon{width:26px;height:26px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:var(--grad);box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 45%,transparent)}
.hicon.g-sas{background:linear-gradient(135deg,var(--accent),var(--accent));box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 45%,transparent)}
.hicon.g-xfer{background:linear-gradient(135deg,var(--accent),var(--accent));box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 45%,transparent)}
.hicon.g-log{background:linear-gradient(135deg,var(--ok),var(--ok));box-shadow:0 2px 8px color-mix(in srgb,var(--ok) 45%,transparent)}
.hicon.g-ask{background:linear-gradient(135deg,var(--accent),var(--accent));box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 45%,transparent)}
.askrow{display:flex;gap:10px;align-items:stretch}
.askbar{flex:1;display:flex;align-items:center;gap:9px;background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:11px;padding:2px 14px;transition:border-color .15s,box-shadow .15s;animation:askglow 3.8s ease-in-out infinite}
.askbar:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);animation:none}
@keyframes askglow{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 0%,transparent)}50%{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}}
.askbar .ask-mag{color:var(--accent);flex:none;display:flex}
.askbar input{flex:1;background:transparent;border:none;outline:none;color:var(--text);font-size:13.5px;padding:10px 0;min-width:0}
.askbar input::placeholder{color:var(--text-3);transition:opacity .3s ease}
.askbar input.ph-dim::placeholder{opacity:.1}
.askgo{flex:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 18px;border-radius:10px;font-weight:600}
.askchips{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:11px}
.askchip-lbl{font-size:11px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:var(--text-3);margin-right:1px}
.askchip{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;background:var(--surface-2);border:1px solid var(--stroke-2);color:var(--text-2);font-size:12px;font-weight:500;cursor:pointer;transition:border-color .14s,background .14s,color .14s,transform .1s}
.askchip:hover{border-color:var(--accent);background:var(--surface-3);color:var(--text);transform:translateY(-1px)}
.askchip:active{transform:translateY(0)}
.askchip>svg{color:var(--accent);flex:none}
.askout{margin-top:15px;display:flex;flex-direction:column;gap:13px}
.ask-q{display:flex;justify-content:flex-end}
.ask-qtext{max-width:82%;background:linear-gradient(135deg,var(--brand),var(--accent));color:var(--color-white,#fff);padding:9px 14px;border-radius:14px 14px 4px 14px;font-size:13px;line-height:1.5;box-shadow:0 2px 10px color-mix(in srgb,var(--accent) 32%,transparent);word-break:break-word}
.ask-a{display:flex;gap:10px;align-items:flex-start}
.ask-av{width:30px;height:30px;flex:none;border-radius:9px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),var(--accent));box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 40%,transparent)}
.ask-abody{flex:1;min-width:0;background:var(--surface-2);border:1px solid var(--stroke);border-radius:4px 14px 14px 14px;padding:13px 15px;animation:askpop .22s ease}
@keyframes askpop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ask-atext{font-size:13px;line-height:1.6;color:var(--text);white-space:pre-wrap;word-break:break-word}
.ask-abody code,.insight-box code{background:var(--surface-3);border:1px solid var(--stroke);border-radius:5px;padding:1px 6px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--accent);white-space:normal;word-break:break-word}
.ask-abody strong,.insight-box strong{color:var(--text);font-weight:600}
.ask-abody .stat{background:var(--accent-soft);border-color:color-mix(in srgb,var(--accent) 30%,transparent);margin:12px 10px 2px 0}
.ask-abody .hbar{font-size:12px;margin:6px 0}
.ask-abody table{width:100%;border-collapse:collapse;margin-top:12px;font-size:12.5px}
.ask-abody th{text-align:left;color:var(--text-3);font-weight:600;font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;padding:6px 10px;border-bottom:1px solid var(--stroke-2)}
.ask-abody td{padding:7px 10px;border-bottom:1px solid var(--stroke);color:var(--text-2)}
.ask-abody tr:last-child td{border-bottom:none}
.sasrow{display:flex;gap:10px;align-items:stretch}
.sasrow input{flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px}
.sasrow button{white-space:nowrap;display:inline-flex;align-items:center;gap:5px;padding:0 16px}
.fbhint{color:var(--text-2);font-size:11.5px;line-height:1.5;margin-top:12px;padding-top:12px;border-top:1px solid var(--stroke)}
.fbhint code{background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:5px;padding:1px 5px;font-size:11px}
.hint{color:var(--text-2);font-size:12px;margin:12px 2px 0;line-height:1.5}
.hint.top{margin:2px 2px 14px}
.seg{display:inline-flex;border:1px solid var(--stroke-2);border-radius:8px;overflow:hidden}
.seg label{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;font-size:12.5px;cursor:pointer;color:var(--text-2);border-right:1px solid var(--stroke-2);transition:.12s;white-space:nowrap}
.seg label:last-child{border-right:none}
.seg label:hover{background:var(--surface-2);color:var(--text)}
.seg input{position:absolute;opacity:0;pointer-events:none}
.seg label:has(input:checked){background:var(--grad-soft);color:var(--text);font-weight:600;box-shadow:inset 0 -2px 0 var(--accent)}
.seg-wide{display:flex;width:100%;border-radius:9px}
.seg-wide label{flex:1;justify-content:center;padding:9px 10px}
.seg-wide label svg{opacity:.85}
.seg-wide label:has(input:checked) svg{color:var(--accent);opacity:1}
.check{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;color:var(--text-2);cursor:pointer;user-select:none}
.check input{margin:0}
.insight-box{margin-top:12px;border:1px solid var(--stroke-2);border-radius:12px;padding:12px 14px;background:var(--grad-soft);font-size:13px;line-height:1.55}
.insight-head{display:flex;align-items:center;gap:8px;font-weight:640;font-size:12.5px;margin-bottom:6px}
.insight-head .ix{margin-left:auto}
.insight-sug{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;padding-top:10px;border-top:1px solid var(--stroke-2)}
.insight-why{margin-top:10px;font-size:11.5px;color:var(--text-2);line-height:1.5;background:color-mix(in srgb,var(--text) 3%,transparent);border:1px solid var(--stroke);border-radius:8px;padding:8px 10px}
.sugcount{font-size:11px;color:var(--accent);background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);border-radius:999px;padding:2px 9px;font-variant-numeric:tabular-nums}
.ix{background:transparent;border:none;color:var(--text-3);font-size:12px;padding:2px 6px;cursor:pointer;border-radius:6px}
.ix:hover{background:var(--surface-2);color:var(--text)}
.rowact{background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:6px;padding:2px 8px;font-size:11px;color:var(--text-2)}
.rowact:hover{background:var(--surface-3);color:var(--text)}
.rowact.del:hover{color:var(--bad,var(--bad));border-color:var(--bad,var(--bad))}

.stat{display:inline-flex;flex-direction:column;padding:12px 18px;border:1px solid var(--stroke-2);border-radius:10px;
  background:var(--grad-soft);margin:0 10px 10px 0;min-width:96px}
.stat b{font-size:20px;font-weight:700;line-height:1.1;color:var(--text)}
.stat span{font-size:11px;color:var(--text-3);margin-top:3px}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0 4px}
.metric{position:relative;padding:14px 16px;border-radius:13px;background:linear-gradient(180deg,var(--surface),var(--surface-2));border:1px solid var(--stroke-2);overflow:hidden}
.metric::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--mc,var(--accent))}
.metric .mk{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3)}
.metric .mk .md{width:8px;height:8px;border-radius:50%;background:var(--mc,var(--accent));box-shadow:0 0 8px var(--mc,var(--accent))}
.metric .mv{font-size:23px;font-weight:750;line-height:1.15;color:var(--text);margin-top:7px;font-variant-numeric:tabular-nums;white-space:nowrap}
.metric .mv small{font-size:13px;font-weight:600;color:var(--text-2);margin-left:2px}
@media(max-width:720px){.metrics{grid-template-columns:repeat(2,1fr)}}
.hbar{display:flex;align-items:center;gap:9px;margin:3px 0;font-size:11.5px}
.hbar .track{flex:1;height:8px;background:var(--surface);border-radius:999px;overflow:hidden}
.hbar .track>i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent));border-radius:999px}
.chart{max-width:680px}
.sect{color:var(--text-3);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;margin:16px 0 8px}
.brow{display:grid;grid-template-columns:108px 1fr;align-items:center;gap:12px;margin:6px 0}
.brow .blabel{color:var(--text-2);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bwrap{position:relative;height:24px;background:color-mix(in srgb,var(--text) 5%,transparent);border-radius:7px;overflow:hidden}
.bwrap .bfill{position:absolute;left:0;top:0;bottom:0;border-radius:7px;min-width:3px;box-shadow:0 1px 6px rgba(0,0,0,.25) inset;transition:width .35s cubic-bezier(.4,0,.2,1)}
.bwrap .bval{position:absolute;right:6px;top:50%;transform:translateY(-50%);line-height:16px;padding:1px 7px;border-radius:6px;background:color-mix(in srgb,var(--text) 55%,transparent);font-size:11px;color:var(--color-white,#fff);white-space:nowrap;font-variant-numeric:tabular-nums;text-shadow:0 1px 2px rgba(0,0,0,.9)}
.bwrap .bval b{font-weight:700}
.bwrap .bval .bmut{color:var(--text-2)}
.lrow{position:relative;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 12px;border-radius:9px;overflow:hidden;margin:5px 0;background:color-mix(in srgb,var(--text) 4%,transparent);border:1px solid var(--stroke)}
.lrow .lfill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 30%,transparent),color-mix(in srgb,var(--accent) 10%,transparent));border-right:1px solid color-mix(in srgb,var(--accent) 45%,transparent)}
.lrow .lname{position:relative;font-size:12.5px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lrow .lsize{position:relative;font-size:12px;color:var(--text-2);white-space:nowrap;font-variant-numeric:tabular-nums;flex:none}
table{width:100%;border-collapse:collapse;font-size:12.5px}
th,td{text-align:left;padding:7px 9px;border-bottom:1px solid var(--stroke)}
th{color:var(--text-3);font-weight:600;font-size:11px;text-transform:none}

.err{background:color-mix(in srgb,var(--bad) 10%,transparent);border:1px solid color-mix(in srgb,var(--bad) 50%,transparent);color:var(--bad);border-radius:10px;padding:10px 14px;margin:14px 22px 0;font-size:12.5px;display:flex;align-items:flex-start;gap:10px}
.err .etext{flex:1}
.err .eclose{cursor:pointer;background:transparent;border:none;color:var(--bad);font-size:16px;line-height:1;padding:0 2px;opacity:.8;flex:none}
.err .eclose:hover{opacity:1}
.err .eact{display:flex;align-items:center;gap:8px;flex:none}
.err .ebtn{cursor:pointer;background:var(--accent);border:none;color:var(--color-white,#fff);font-size:12px;font-weight:600;border-radius:7px;padding:5px 12px;white-space:nowrap}
.err .ebtn:hover{background:var(--accent)}
.err.err-auth{background:color-mix(in srgb,var(--accent) 10%,transparent);border-color:color-mix(in srgb,var(--accent) 45%,transparent);color:var(--accent)}
.err.err-auth .eclose{color:var(--accent)}
.log{font-family:ui-monospace,SFMono-Regular,monospace;font-size:11px;color:var(--text-2);white-space:pre-wrap;max-height:170px;overflow-y:auto;background:color-mix(in srgb,var(--text) 50%,transparent);border:1px solid var(--stroke);border-radius:10px;padding:10px 12px}
.mono{font-family:ui-monospace,monospace;font-size:11px;color:var(--text-3);white-space:pre-wrap;word-break:break-all;background:color-mix(in srgb,var(--text) 50%,transparent);border:1px solid var(--stroke);border-radius:8px;padding:8px 10px;margin-top:6px}
.spin{width:13px;height:13px;display:inline-block;animation:sp .7s linear infinite;vertical-align:middle}
@keyframes sp{to{transform:rotate(360deg)}}

/* subscription scope bar + chip */
.scopebar{display:flex;align-items:stretch;gap:8px}
.scopechip{flex:1;display:flex;align-items:center;gap:8px;min-width:0;padding:8px 11px;border-radius:10px;
  background:var(--grad-soft);border:1px solid var(--stroke-2);font-size:12.5px;font-weight:600;color:var(--text);cursor:pointer}
.scopechip:hover{border-color:var(--accent)}
.scopechip .k{font-size:13px}
.scopechip #scopeLabel{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.scopechip .scope-sub{color:var(--text-3);font-weight:400;font-size:11px;margin-left:3px}
.scopebtn{border:1px solid var(--stroke-2);background:var(--surface);color:var(--text-2);border-radius:10px;padding:0 12px;font-size:12px;font-weight:600;cursor:pointer}
.scopebtn:hover{border-color:var(--accent);color:var(--text)}

/* CTA shown in the tree when nothing is selected */
.tree-cta{text-align:center;padding:26px 14px;color:var(--text-2)}
.tree-cta .ic{font-size:26px;margin-bottom:8px}
.tree-cta p{margin:0 0 14px;font-size:12.5px;line-height:1.5}
.tree-cta button{background:var(--brand);color:var(--color-white,#fff);border:none;border-radius:8px;padding:9px 16px;font-weight:600;font-size:12.5px;cursor:pointer}
.tree-cta button:hover{background:var(--brand-hover)}

/* subscription picker modal */
.overlay{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;
  background:rgba(0,0,0,.6);backdrop-filter:blur(3px)}
.overlay.open{display:flex}
.dialog{width:min(440px,90vw);max-height:70vh;display:flex;flex-direction:column;
  background:var(--panel);border:1px solid var(--stroke-2);border-radius:12px;
  box-shadow:0 16px 48px rgba(0,0,0,.55);overflow:hidden}
.dialog::before{content:"";display:block;height:2px;background:var(--brand)}
.dlg-head{display:flex;align-items:flex-start;gap:10px;padding:16px 18px 8px}
.dlg-head h3{margin:0;font-size:15px;font-weight:600;color:var(--text)}
.dlg-sub{margin:4px 0 0;font-size:12px;color:var(--text-3)}
.dlg-head .iconbtn{margin-left:auto}
.dlg-search{position:relative;margin:6px 20px 0}
.dlg-search input{width:100%;background:var(--surface);border:1px solid var(--stroke-2);border-radius:10px;padding:9px 12px 9px 32px;color:var(--text);font-size:13px;outline:none}
.dlg-search input:focus{border-color:var(--accent);box-shadow:var(--glow)}
.dlg-search .mag{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--accent);display:flex;align-items:center;pointer-events:none}
.dlg-search .mag svg{width:15px;height:15px;display:block}
.dlg-meta{display:flex;align-items:center;justify-content:space-between;padding:11px 20px 6px;font-size:11.5px}
.linkbtn{background:none;border:none;color:var(--accent);font-size:11.5px;font-weight:600;cursor:pointer;padding:0}
.linkbtn:hover{color:var(--cyan);text-decoration:underline}
.dlg-list{flex:1;overflow-y:auto;padding:4px 12px 10px;margin:0 8px}
.subrow{display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:10px;cursor:pointer;border:1px solid transparent}
.subrow:hover{background:var(--surface)}
.subrow.on{background:var(--grad-soft);border-color:var(--stroke-2)}
.subrow input{width:16px;height:16px;accent-color:var(--accent);cursor:pointer;flex:none}
.subrow .info{min-width:0}
.subrow .nm{font-size:12.5px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.subrow .id{font-size:10.5px;color:var(--text-3);font-family:ui-monospace,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dlg-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 20px;border-top:1px solid var(--stroke)}
button.danger{border-color:color-mix(in srgb,var(--bad) 50%,transparent);color:var(--bad);background:var(--surface-2)}
button.danger:hover{background:color-mix(in srgb,var(--bad) 14%,transparent);color:var(--bad)}
.addbtn,.delbtn{background:none;border:none;color:var(--text-3);cursor:pointer;font-size:12px;line-height:1;padding:2px 5px;flex:none;border-radius:6px}
.addbtn{margin-left:auto}
.tmeta+.addbtn,.tmeta+.delbtn{margin-left:6px}
.addbtn:hover{color:var(--cyan);background:var(--surface-2)}
.delbtn:hover{color:var(--bad);background:var(--surface-2)}
.trow .delbtn{opacity:0;margin-left:6px}
.trow:hover .delbtn{opacity:1}
.pinbtn{background:none;border:none;color:var(--text-3);cursor:pointer;font-size:12px;line-height:1;padding:2px 5px;flex:none;border-radius:6px;opacity:0;margin-left:4px}
.trow:hover .pinbtn{opacity:1}
.pinbtn.on{opacity:1;color:var(--azure)}
.pinbtn:hover{color:var(--azure);background:var(--surface-2)}
.pinhdr .ti{color:var(--azure)}
#dataBody{position:relative}
.dropmask{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:color-mix(in srgb,var(--accent) 10%,transparent);border:2px dashed var(--accent);border-radius:12px;z-index:6;pointer-events:none}
#dataBody.dragging .dropmask{display:flex}
.dropmsg{display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--accent);font-weight:600;font-size:14px;text-align:center}
.dropic{font-size:30px;line-height:1}
.vtool{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--stroke)}
.rowact{background:none;border:1px solid var(--stroke-2);color:var(--text-2);border-radius:7px;padding:2px 9px;font-size:11px;cursor:pointer;flex:none}
.rowact:hover{border-color:var(--accent);color:var(--text)}
.rowact.del:hover{border-color:var(--bad);color:var(--bad)}
.dti{display:inline-flex;align-items:center}.dti .svi{width:17px;height:17px}
.vtool .grow{margin-left:auto}
.browsetools button{padding:7px 13px;font-size:12px}
.browsetools .primary{background:var(--brand);color:var(--color-white,#fff);border:1px solid transparent;font-weight:600}
.browsetools .primary:hover{background:var(--brand-hover);color:var(--color-white,#fff)}
.browsetools input[type=file]{min-width:230px;font-size:12px;color:var(--text-2)}
.browsetools input[type=file]::file-selector-button{background:var(--surface-3);color:var(--text);border:1px solid var(--stroke-2);border-radius:7px;padding:6px 12px;margin-right:9px;font-size:12px;font-weight:560;cursor:pointer}
.browsetools input[type=file]::file-selector-button:hover{border-color:var(--accent)}
.vhint{color:var(--text-3);font-size:11.5px;margin:10px 2px 0;display:flex;align-items:center;gap:6px}
.welcome{padding:6px 2px 10px}
.wlead{display:flex;align-items:center;gap:11px;padding:2px 2px 16px}
.wlead .wl-ic{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--grad-soft);border:1px solid var(--stroke-2);flex:none}
.wlead .wl-ic .svi{width:21px;height:21px}
.wlead h3{margin:0;font-size:14.5px;font-weight:640}
.wlead p{margin:2px 0 0;font-size:12px;color:var(--text-2);line-height:1.45}
.wtiles{display:grid;grid-template-columns:repeat(2,1fr);gap:11px}
.wtile{text-align:left;background:var(--surface-2);border:1px solid var(--stroke);border-radius:11px;padding:14px;display:flex;gap:11px;align-items:flex-start;transition:border-color .15s,background .15s,transform .12s}
.wtile.act{cursor:pointer}
.wtile.act:hover{border-color:var(--accent);background:var(--grad-soft);transform:translateY(-1px)}
.wtile .wt-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:var(--bg);border:1px solid var(--stroke-2);flex:none}
.wtile .wt-ic .svi{width:18px;height:18px}
.wtile h4{margin:0 0 3px;font-size:12.5px;font-weight:620;display:flex;align-items:center;gap:7px}
.wtile p{margin:0;font-size:11px;color:var(--text-2);line-height:1.5}
.wtile .wt-cta{margin-top:7px;font-size:10.5px;font-weight:600;color:var(--accent);display:flex;align-items:center;gap:4px;opacity:0;transition:opacity .15s}
.wtile.act:hover .wt-cta{opacity:1}
@media (max-width:640px){.wtiles{grid-template-columns:1fr}}
.svcbar{display:flex;gap:6px;background:var(--surface-2);border:1px solid var(--stroke);border-radius:12px;padding:5px;margin-bottom:14px}
.seg{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 8px;border-radius:9px;background:transparent;border:1px solid transparent;color:var(--text-2);font-size:12px;font-weight:560;cursor:pointer;transition:.13s}
.seg:hover{background:var(--bg);color:var(--text)}
.seg.act{background:var(--grad-soft);border-color:var(--accent);color:var(--text);box-shadow:var(--glow)}
.seg .svi{width:16px;height:16px;flex:none}
.segl{white-space:nowrap}
.segn{min-width:19px;padding:0 5px;height:18px;line-height:17px;text-align:center;border-radius:9px;background:var(--bg);border:1px solid var(--stroke-2);font-size:10.5px;font-weight:660;color:var(--text-2)}
.seg.act .segn{background:var(--accent);color:var(--on-accent);border-color:transparent}
@media (max-width:600px){.segl{display:none}}
.svc-sub{display:flex;align-items:center;gap:12px;margin:-4px 0 14px;padding-bottom:12px;border-bottom:1px solid var(--stroke)}
.backlink{background:transparent;border:1px solid var(--stroke-2);border-radius:8px;padding:5px 11px;color:var(--accent);font-size:12px;font-weight:560;cursor:pointer}
.backlink:hover{background:var(--surface-2);border-color:var(--accent)}
.svc-cur{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:620}
.svc-cur .svi{width:16px;height:16px}
.blobnav{margin:16px 0 18px}
.blobtab-back{display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);border:1px solid var(--stroke-2);color:var(--text-2);font-size:11.5px;font-weight:600;cursor:pointer;padding:6px 12px;border-radius:8px;margin-bottom:10px}
.blobtab-back:hover{color:var(--text);border-color:var(--accent);background:var(--surface-3)}
.blobtabgroup{display:flex;gap:5px;padding:5px;background:var(--surface-2);border:1px solid var(--stroke);border-radius:13px;box-shadow:inset 0 1px 0 color-mix(in srgb,var(--text) 2%,transparent)}
.blobtab{flex:1;position:relative;display:inline-flex;align-items:center;justify-content:center;gap:9px;background:transparent;border:0;padding:12px 10px;color:var(--text-2);font-size:13.5px;font-weight:600;cursor:pointer;border-radius:9px;transition:background .15s,color .15s,box-shadow .15s}
.blobtab:hover{background:var(--surface-3);color:var(--text)}
.blobtab.active{background:linear-gradient(180deg,var(--accent),var(--accent));color:var(--color-white,#fff);box-shadow:0 2px 9px color-mix(in srgb,var(--accent) 40%,transparent)}
.blobtab .tbi{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:color-mix(in srgb,var(--text) 5%,transparent);flex:none}
.blobtab.active .tbi{background:color-mix(in srgb,var(--text) 18%,transparent)}
.xdestmode{margin:6px auto 9px;display:flex;width:fit-content;max-width:100%;flex:none;justify-content:flex-start;padding:0;border:1px solid var(--stroke-2);border-radius:8px;overflow:hidden}
.xdestpick{display:flex;align-items:center;gap:8px}
.xdestpick select{flex:1;min-width:0}
.xdestslash{color:var(--text-3);font-weight:700;flex:none}
.xferbar{padding:16px 18px}
.xflow{display:grid;grid-template-columns:1fr 44px 1.25fr;gap:12px;align-items:end}
.xcol{display:flex;flex-direction:column;gap:7px;min-width:0}
.xlbl{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3)}
.xlbl-row{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:24px}
.xcol .xdestmode{margin:0}
.seg-sm label{padding:3px 11px;font-size:10.5px;font-weight:600}
.xarrow{align-self:end;width:34px;height:34px;margin:0 auto 3px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--accent);background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 32%,transparent);box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 18%,transparent)}
.xfoot{display:flex;align-items:center;gap:14px;margin-top:15px;padding-top:14px;border-top:1px solid var(--stroke);flex-wrap:wrap}
.xfoot .grow{flex:1;min-width:8px}
.xconf{display:flex;align-items:center;gap:11px;min-width:0}
.xconf .xlbl{white-space:nowrap}
.xres-seg{flex:none}
.xres-seg label{padding:6px 13px}
.xfoot .check{white-space:nowrap;color:var(--text-2);font-size:12px}
.xfoot button.primary{padding:8px 16px;font-size:12.5px}
.selx{position:relative;min-width:0}
.selx-native{position:absolute!important;width:1px;height:1px;padding:0;margin:0;opacity:0;pointer-events:none;overflow:hidden;clip:rect(0 0 0 0)}
.selx-btn{width:100%;box-sizing:border-box;display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:9px;color:var(--text);font-size:13px;cursor:pointer;transition:border-color .14s,box-shadow .14s,background .14s;text-align:left}
.selx-btn:hover{border-color:var(--accent);background:var(--surface-3)}
.selx-btn:disabled{opacity:.55;cursor:not-allowed}
.selx.open .selx-btn{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);background:var(--surface-3)}
.selx-txt{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.selx-car{flex:none;color:var(--text-3);transition:transform .18s,color .18s}
.selx.open .selx-car{transform:rotate(180deg);color:var(--accent)}
.selx-pop{position:fixed;z-index:9999;background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:12px;padding:5px;box-shadow:0 18px 48px rgba(0,0,0,.55),0 3px 10px rgba(0,0,0,.4);max-height:260px;overflow-y:auto;opacity:0;transform:translateY(-6px) scale(.98);pointer-events:none;transition:opacity .15s,transform .15s}
.selx-pop.show{opacity:1;transform:none;pointer-events:auto}
.selx-item{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;font-size:13px;color:var(--text-2);cursor:pointer;transition:background .1s,color .1s}
.selx-item:hover{background:var(--grad-soft);color:var(--text)}
.selx-item.on{color:var(--text);font-weight:600;background:var(--accent-soft)}
.selx-item>svg{flex:none;opacity:0;color:var(--accent)}
.selx-item.on>svg{opacity:1}
.selx-item>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.selx-pop::-webkit-scrollbar{width:10px}
.selx-pop::-webkit-scrollbar-thumb{background:var(--stroke-2);border-radius:6px;border:2px solid var(--surface-2)}
.xdestpick .selx{flex:1;min-width:0}
.blobtab .svi{width:16px;height:16px;flex:none}
.hubpanel{margin-top:12px}
.hubshare{padding:8px 2px;display:flex;flex-direction:column;align-items:center;text-align:center}
.hubshare .hs-lead{color:var(--text-2);font-size:12.5px;margin:0 auto 16px;line-height:1.6;max-width:660px}
.svc-desc{display:flex;align-items:center;gap:8px;color:var(--text-2);font-size:11.5px}
.svc-desc .svi{width:15px;height:15px;flex:none}
.svc-item .fname{display:flex;align-items:center;gap:8px}
.svc-item .fname .svi{width:15px;height:15px;flex:none}
.imeta{color:var(--text-3);font-size:11px;margin-right:8px}
.dlsaved{display:flex;flex-direction:column;align-items:stretch;gap:10px;margin-top:12px;padding:13px 14px;border:1px solid color-mix(in srgb,var(--ok) 40%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--ok) 14%,transparent),color-mix(in srgb,var(--ok) 8%,transparent));border-radius:12px}
.dlsaved .dls-top{display:flex;align-items:center;gap:10px}
.dlsaved .dls-ic{width:30px;height:30px;flex:none;display:flex;align-items:center;justify-content:center;border-radius:8px;background:color-mix(in srgb,var(--ok) 18%,transparent);font-size:16px}
.dlsaved .dls-lead{font-size:13px;font-weight:640;color:var(--text);line-height:1.25}
.dlsaved .dls-path{display:block;font-size:11.5px;color:var(--text-2);background:var(--bg);border:1px solid var(--stroke-2);border-radius:8px;padding:7px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.dlsaved .dls-acts{display:flex;gap:8px}
.dlsaved .dls-acts .primary{flex:1;justify-content:center}
.dlsaved .dls-acts .ghost{flex:none}
.xfer{position:fixed;right:18px;bottom:18px;width:372px;max-width:calc(100vw - 36px);z-index:120;background:var(--surface);border:1px solid var(--stroke);border-radius:14px;padding:14px 15px;box-shadow:0 12px 40px rgba(0,0,0,.5);animation:xfup .18s ease}
@keyframes xfup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.xf-head{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.xf-title{font-size:12.5px;font-weight:640;display:flex;align-items:center;gap:7px;flex:1}
.xf-x{background:transparent;border:0;color:var(--text-3);cursor:pointer;font-size:13px;line-height:1;padding:3px 6px;border-radius:6px}
.xf-x:hover{background:var(--surface-2);color:var(--text)}
.xf-bar{height:7px;border-radius:999px;background:var(--surface-2);overflow:hidden}
.xf-bar i{display:block;height:100%;background:var(--grad);border-radius:999px;transition:width .25s}
.xf-meta{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:11px;color:var(--text-2)}
.xf-fails{margin-top:10px;display:flex;flex-direction:column;gap:5px;max-height:130px;overflow:auto}
.xf-fail{font-size:11px;background:color-mix(in srgb,var(--bad) 10%,transparent);border:1px solid color-mix(in srgb,var(--bad) 28%,transparent);border-radius:8px;padding:6px 8px}
.xf-fail b{display:block;color:var(--text);word-break:break-all}
.xf-fail span{color:var(--text-3)}
.xfer .dlsaved{margin-top:11px}
.entgrid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:14px}
.entfield{display:flex;flex-direction:column;gap:5px}
.entfield span{font-size:11px;color:var(--text-2);font-weight:600}
.entfield input{background:var(--surface);border:1px solid var(--stroke-2);border-radius:9px;padding:8px 11px;color:var(--text);font-size:12.5px;outline:none}
.entfield input:focus{border-color:var(--accent);box-shadow:var(--glow)}
.entfield input[readonly]{opacity:.7;cursor:not-allowed}
.entprops-head{display:flex;align-items:center;justify-content:space-between;margin:4px 0 8px}
.entprops-head span{font-size:11px;color:var(--text-2);font-weight:600;text-transform:uppercase;letter-spacing:.4px}
#entProps{display:flex;flex-direction:column;gap:8px;max-height:240px;overflow:auto}
.entrow{display:grid;grid-template-columns:1fr 108px 1.3fr 30px;gap:7px;align-items:center}
.entrow input,.entrow select{background:var(--surface);border:1px solid var(--stroke-2);border-radius:8px;padding:7px 9px;color:var(--text);font-size:12px;outline:none;min-width:0}
.entrow input:focus,.entrow select:focus{border-color:var(--accent);box-shadow:var(--glow)}
.entrow .epx{padding:5px 0;text-align:center}
.dlg-err{color:var(--bad);font-size:11.5px}
.sgfield{margin-bottom:16px}
.sgfield .sglabel{display:block;font-size:11px;color:var(--text-2);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:9px}
.sgperms{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:9px}
.sgperm{display:flex;flex-direction:column;gap:2px;position:relative;padding:11px 12px 11px 34px;border:1px solid var(--stroke-2);border-radius:10px;cursor:pointer;transition:.13s;background:var(--surface-2)}
.sgperm:hover{border-color:var(--accent)}
.sgperm input{position:absolute;left:12px;top:13px;width:15px;height:15px;accent-color:var(--accent)}
.sgperm .sgpttl{font-size:12.5px;font-weight:620;color:var(--text)}
.sgperm .sgpdesc{font-size:10.5px;color:var(--text-3)}
.sgperm:has(input:checked){border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
.sgexp{display:flex;gap:8px;flex-wrap:wrap}
.sgchip{font-size:12px;font-weight:600;padding:7px 14px;border-radius:999px;border:1px solid var(--stroke-2);background:var(--surface-2);color:var(--text-2);cursor:pointer;transition:.13s}
.sgchip:hover{border-color:var(--accent);color:var(--text)}
.sgchip.active{background:var(--grad);border-color:transparent;color:var(--color-white,#fff)}
.sgresult{margin-top:4px;padding:13px 14px;border:1px solid color-mix(in srgb,var(--ok) 40%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--ok) 14%,transparent),color-mix(in srgb,var(--ok) 7%,transparent));border-radius:12px}
.sgresult .sgok{font-size:12px;font-weight:600;color:var(--ok);margin-bottom:9px;display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.sgresult .sgbadge{font-size:10px;font-weight:700;color:var(--text-2);background:var(--surface-2);border:1px solid var(--stroke-2);border-radius:999px;padding:2px 9px;text-transform:none;letter-spacing:0}
.sgurl{width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--stroke-2);border-radius:9px;padding:9px 11px;color:var(--text);font:11.5px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;outline:none;resize:vertical;min-height:56px;word-break:break-all}
.build-stamp{display:inline-flex;align-items:center;gap:8px;min-width:0;overflow-wrap:anywhere;font-family:inherit;font-size:11px;color:var(--text-3)}
.feedback-link{display:inline-flex;align-items:center;gap:6px;color:var(--accent);text-decoration:none;font-weight:400;font-family:inherit;font-size:12px;border-radius:6px;padding:3px 6px;white-space:nowrap}
.feedback-link:hover{text-decoration:underline}
.feedback-link:focus-visible{outline:2px solid var(--color-focus-outline,var(--accent));outline-offset:2px}
/* All UI surfaces derive from the host's documented semantic contract. */
:root:root{
  --bg-2:color-mix(in srgb,var(--bg) 97%,var(--text));
  --panel:var(--bg);--surface:color-mix(in srgb,var(--bg) 96%,var(--text));
  --surface-2:color-mix(in srgb,var(--bg) 92%,var(--text));
  --surface-3:color-mix(in srgb,var(--bg) 86%,var(--text));
  --stroke-2:color-mix(in srgb,var(--stroke) 75%,var(--text));
  --text-1:var(--text);--text-2:color-mix(in srgb,var(--text) 85%,var(--bg));
  --accent:var(--true-color-blue,var(--azure));--accent-2:var(--accent);
  --cyan:var(--accent);--brand:var(--accent);
  --brand-hover:color-mix(in srgb,var(--accent) 85%,var(--text));
  --brand-press:color-mix(in srgb,var(--accent) 75%,var(--text));
  --accent-soft:var(--true-color-blue-muted,color-mix(in srgb,var(--accent) 12%,var(--bg)));
  --sel:color-mix(in srgb,var(--accent) 16%,var(--bg));
  --on-accent:var(--color-white,#fff);--code-bg:var(--bg-2);--code-text:var(--text);
  --bad:var(--true-color-red,#cf222e);--warn:var(--text-2);--ok:var(--accent);
  --grad:linear-gradient(135deg,var(--accent),var(--brand-hover));--grad-soft:var(--accent-soft);
  --glow:0 0 0 2px var(--color-focus-outline,var(--accent));
}
body{font-family:var(--font-sans,-apple-system,"Segoe UI",sans-serif)}
button,input,select,textarea{font-family:inherit}
button:focus-visible,.card-head:focus-visible{outline:2px solid var(--color-focus-outline,var(--accent));outline-offset:2px}
.iconbtn,.railbtn{padding:0;line-height:1;flex:none}
.ti,.dti,.wt-ic,.cx-i{display:inline-flex;align-items:center;justify-content:center}
.railbtn .svi{width:22px;height:22px}
.dti .svi{width:22px;height:22px}
.wt-ic .svi{width:28px;height:28px}
.cx-i .svi{width:16px;height:16px}
.svcbar .svi{width:18px;height:18px}
.card-head h2{min-width:0;flex-wrap:wrap;font-weight:var(--font-weight-semibold,600)}
.list,.log,.mono,.dlpath,.sasm .c{background:var(--bg-2)}
.hicon,.hicon.g-sas,.hicon.g-xfer,.hicon.g-log,.hicon.g-ask,.ask-av,.xempty .xe-ic{background:var(--grad)}
.err,.xerr{color:var(--bad);background:var(--true-color-red-muted,color-mix(in srgb,var(--bad) 10%,var(--bg)));border-color:var(--bad)}
.err .eclose,.xerr-ic,.xm-warn .xm-v{color:var(--bad)}
.xerr.xwarn{color:var(--warn);background:color-mix(in srgb,var(--warn) 10%,var(--bg));border-color:var(--warn)}
.xwarn .xerr-ic{color:var(--warn)}
.err .etext{min-width:0;overflow-wrap:anywhere}
.subscription-errors{margin-top:8px;color:var(--text-2)}
.subscription-errors summary{cursor:pointer;color:var(--bad)}
.subscription-error{margin:8px 0}
.err.err-auth,.err.err-auth .eclose{color:var(--accent)}
.err.err-auth{background:var(--accent-soft);border-color:var(--accent)}
.chip.warn,.pill.warn,.xchip-warn{color:var(--warn);background:var(--surface-2);border-color:var(--stroke-2)}
.askchip>svg,.ask-abody code,.insight-box code,.xep-dst .xep-ic{color:var(--accent)}
[hidden]{display:none!important}
body{height:100vh;display:flex;flex-direction:column;overflow:hidden}
.appbar,#err{flex:none}
.ctx{flex:none;margin:0;padding:7px 20px;min-height:32px;box-sizing:border-box;border-left:0;border-bottom:1px solid var(--stroke)}
.ti>svg{width:15px;height:15px;display:block;flex:none}
.shell{flex:1;height:auto;min-height:0}
.main{padding-bottom:18px}
.debug-panel{flex:none;border-top:1px solid var(--stroke);background:var(--bg);min-height:0}
.debug-panel>summary{padding:5px 16px;font-size:12px;color:var(--text-2);cursor:pointer;user-select:none}
.debug-panel .log{margin:0;padding:8px 16px;border:0;border-top:1px solid var(--stroke);border-radius:0;max-height:min(24vh,200px);overflow:auto;overflow-wrap:anywhere;font-family:var(--font-mono,monospace)}
.diagnostics-link{padding:0 4px;min-height:24px;border:1px solid transparent;background:transparent;color:var(--text-2)}
.diagnostics-link:hover,.diagnostics-link:focus-visible{border-color:var(--stroke-2)}
.cx-sep{opacity:1;color:var(--text-2)}
.tw{display:grid;place-items:center;width:16px;height:16px;color:var(--text-2)}
.tw svg{width:14px;height:14px;pointer-events:none}
.tchildren{margin-left:12px;padding-left:8px}
.side.collapsed #visibilityBtn{display:none}
.tree-failure{color:var(--text-2);font-style:normal}
.tree-failure details{margin-top:4px}
.tree-failure pre{white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.4 var(--font-mono,monospace);max-height:120px;overflow:auto}
.visibility-copy{padding:0 16px;font-size:12px;color:var(--text-2)}
.visibility-row{display:flex;align-items:center;gap:6px;padding:5px 8px;font-size:12px;user-select:none}
.visibility-row.sub{padding-left:26px}
.visibility-row{white-space:nowrap;min-width:0;height:28px;box-sizing:border-box}
.visibility-row input{flex:none}
.visibility-label{overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}
.visibility-domain{color:var(--text-2);flex:0 1 42%;min-width:0;overflow:hidden;text-overflow:ellipsis}
.dialog .dlg-list{overflow:auto;min-height:0}
.xdestpick select,.selx-btn{min-height:28px;padding:4px 8px}
button,.trow,.card-head,.resource-head,.seg{user-select:none;-webkit-user-select:none}
button{min-height:28px;padding:4px 9px;border-radius:5px;font-size:12px;font-weight:400}
button svg,button .svi{width:16px;height:16px}
.iconbtn{width:28px;height:28px}
.side-head{min-height:42px;padding:6px 8px;gap:6px}
.side-head .t{font-size:13px}
.side.collapsed #refreshBtn{display:none}
.trow{height:30px;min-height:30px;box-sizing:border-box;padding:1px 5px;border-radius:4px;gap:5px}
.trow:focus-visible{outline:2px solid var(--color-focus-outline,var(--accent));outline-offset:-2px}
.tree-hint{font-size:11px;color:var(--text-2);padding:4px 6px 10px}
.tree-failure{white-space:normal;overflow-wrap:anywhere;color:var(--text-2)}
.resource-pane{min-width:0}
.resource-head{padding:4px 0;border-bottom:1px solid var(--stroke)}
.resource-head h2{display:flex;align-items:center;gap:6px;margin:0;font-size:14px;font-weight:600}
.resource-body{padding:4px 0}
.resource-actions{margin-top:10px}
.resource-search{display:block;width:100%;box-sizing:border-box;min-height:28px;margin:0 0 8px;padding:4px 8px;border:1px solid var(--stroke-2);border-radius:5px;background:var(--surface);color:var(--text)}
.visibility-tools{padding:0 16px 8px;display:flex;gap:6px;flex-wrap:wrap}
.visibility-tools input{width:100%;box-sizing:border-box;min-height:28px;padding:4px 8px;background:var(--surface);color:var(--text);border:1px solid var(--stroke-2);border-radius:5px}
.pinhdr .ti{font-size:17px;width:18px;height:18px}
.pinbtn{font-size:17px;min-width:26px;min-height:26px;padding:2px}
.pinbtn:focus-visible,.trow:focus-within .pinbtn{opacity:1}
.pinbtn svg,.pinhdr .ti svg{width:18px;height:18px;display:block}
.pinbtn.on svg,.pinhdr .ti svg{fill:currentColor}
.resource-toolbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:8px 0}
.resource-toolbar .resource-search{flex:1;min-width:140px;width:auto;margin:0}
.resource-pane .vtool{gap:6px;justify-content:flex-start;margin:8px 0;padding:0;border:0}
.vtool input:not([type="file"]){box-sizing:border-box;height:28px;min-height:28px;min-width:140px;padding:4px 8px;font:inherit;font-size:12px}
.resource-pane button.primary,.resource-toolbar button,.browsetools button,.vtool button,.blobtab-back,.backlink{background:var(--surface);color:var(--text-2);border:1px solid var(--stroke-2);box-shadow:none;font-weight:400;border-radius:4px;min-height:28px;padding:4px 8px}
.resource-pane button.primary:hover,.resource-toolbar button:hover,.browsetools button:hover,.vtool button:hover{background:var(--surface-2);color:var(--text)}
.resource-pane button svg,.vtool button svg{width:16px;height:16px;vertical-align:middle;flex:none}
.blobnav{margin:8px 0}
.resource-path{display:flex;align-items:center;gap:6px;min-width:0;max-width:100%;margin:0;font-size:12px}
.resource-path .path-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.resource-path{flex-wrap:nowrap;padding:0;min-height:28px}
.path-link{background:transparent;border:1px solid transparent;color:var(--text);padding:3px 5px;font:inherit;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.path-link:hover,.path-link:focus-visible{border-color:var(--stroke-2);background:var(--surface-2)}
.blobtabgroup{display:flex;justify-content:flex-start;padding:0;gap:4px;border:0;border-radius:0;background:transparent;box-shadow:none}
.blobtab{flex:none;min-height:28px;font-size:12px;font-weight:400;padding:4px 8px;gap:5px;border-radius:4px;border:1px solid transparent}
.blobtab .tbi{width:16px;height:16px;background:transparent;border-radius:0}
.blobtab.active{background:var(--surface-2);color:var(--text);border-color:var(--stroke-2);box-shadow:none}
.blobtab.active .tbi{background:transparent}
.blob-check{width:14px;height:14px;margin:0 6px 0 0;flex:none}
button.resource-delete{display:inline-grid;place-items:center;width:28px;height:28px;padding:0;border:1px solid transparent;background:transparent;color:var(--text-2);box-shadow:none}
button.resource-delete:hover,button.resource-delete:focus-visible{border-color:var(--stroke-2);background:var(--surface-2);color:var(--bad)}
.agent-note{margin-top:12px;padding:10px;border-left:2px solid var(--accent);background:var(--surface-2)}
.agent-note h3{font-size:12px;margin:0 0 8px}
.card-head{padding:8px 10px}
.card-sub{margin:4px 0 12px}
.factions button,.browsetools button,.sasrow button{min-height:28px;padding:4px 9px;font-size:12px;font-weight:400}
button.primary,.factions button,.sasrow button{background:var(--surface);border:1px solid var(--stroke-2);color:var(--text-2);box-shadow:none;font-weight:400}
button.primary:hover,.factions button:hover,.sasrow button:hover{background:var(--surface-2);color:var(--text)}
.row .fname{display:flex;align-items:center;gap:6px;min-width:0}
.row .fname>svg{width:16px;height:16px;flex:none}
.row .meta{display:inline-flex;align-items:center;gap:4px}
.vtool .resource-search{flex:1;min-width:140px;width:auto;margin:0}
.resource-pane .vtool button.resource-delete{min-width:28px;min-height:28px;padding:0;border-color:transparent;background:transparent}
.resource-pane .vtool button.resource-delete:hover,.resource-pane .vtool button.resource-delete:focus-visible{border-color:var(--stroke-2);background:var(--surface-2)}
.resource-delete[data-blobsas]:hover,.resource-delete[data-blobsas]:focus-visible,.resource-delete[data-shdl]:hover,.resource-delete[data-shdl]:focus-visible{color:var(--text)}
.secta{flex-wrap:wrap}
.secta-tx{flex:1 1 220px}
.secta-btn{box-sizing:border-box;max-width:100%;min-width:0;min-height:28px;padding:4px 8px;border-radius:4px;font-weight:400;background:var(--surface);color:var(--text-2);overflow:hidden}
.sgperm .sgpttl{font-weight:400}
.svcbar{padding:3px;gap:3px;border-radius:5px}
.seg{padding:4px 6px;min-height:28px;border-radius:4px;font-weight:400}
.card-head .cw{width:24px;height:24px}
.card-head .cw svg{width:18px;height:18px}
.hicon{width:20px;height:20px;border-radius:4px;box-shadow:none;color:var(--color-white,#fff)}
.dti .svi,.svcbar .svi{width:16px;height:16px}
.resource-context{display:flex;flex-direction:column;align-items:stretch;gap:4px;margin:4px 0}
.resource-context .resource-path{flex:none;min-width:0}
.resource-context .search{flex:none;min-width:0;width:100%}
.resource-context .search input{box-sizing:border-box;width:100%}
.resource-path .backlink,.resource-path .path-link{display:inline-flex;align-items:center;gap:4px;background:transparent;border:1px solid transparent;color:var(--text);font:inherit;min-height:28px;padding:3px 5px;border-radius:4px;box-shadow:none}
.resource-path .backlink:hover,.resource-path .backlink:focus-visible,.resource-path .path-link:hover,.resource-path .path-link:focus-visible{border-color:var(--stroke-2);background:var(--surface-2)}
.resource-path>button{flex:none;white-space:nowrap}
.resource-path>.path-current{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;display:block}
.path-overflow{position:relative;flex:none}
.path-overflow summary{display:grid;place-items:center;width:28px;height:28px;cursor:pointer;border:1px solid var(--stroke-2);border-radius:4px;list-style:none}
.path-overflow summary::-webkit-details-marker{display:none}
.path-overflow-menu{position:absolute;left:0;top:100%;z-index:30;min-width:160px;max-width:min(360px,calc(100vw - 30px));max-height:240px;overflow:auto;padding:4px;border:1px solid var(--stroke-2);border-radius:4px;background:var(--panel);box-shadow:var(--shadow)}
.resource-path .path-overflow-menu button{display:block;width:100%;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vtool button,.resource-toolbar button,.side-toolbar button{display:inline-flex;align-items:center;justify-content:center;gap:4px;box-sizing:border-box;min-height:28px;padding:4px 8px;font:inherit;font-size:12px;background:var(--surface);border:1px solid var(--stroke-2);color:var(--text-2);border-radius:4px;box-shadow:none}
.resource-pane .vtool button:disabled{opacity:.45;cursor:default}
.mainwrap{display:flex;flex-direction:column;height:100%;min-height:100%;gap:8px}
.mainwrap>.card{flex-shrink:0}
.resource-pane{display:flex;flex-direction:column;flex:1 0 440px;min-height:0}
.resource-body{display:flex;flex-direction:column;flex:1;min-height:0}
#dataBody{display:flex;flex-direction:column;flex:1;min-height:0}
.resource-list{flex:1;min-height:240px;height:0;overflow:auto;border:1px solid var(--stroke);border-radius:5px}
#svcBar,.resource-context,.resource-toolbar,.browsetools{flex-shrink:0}
.resource-list .list{border:0;border-radius:0;margin:0;max-height:none;overflow:visible;background:transparent}
.resource-list .row{display:grid;grid-template-columns:minmax(0,1fr) minmax(70px,auto);align-items:center;min-height:40px;font-size:12px}
.resource-list .fname{overflow:hidden}
.resource-list .fname>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row-check-space{width:20px;flex:none}
.resource-list-header{display:flex;justify-content:space-between;gap:12px;padding:6px 9px;border-bottom:1px solid var(--stroke);font-size:11px;color:var(--text-3);position:sticky;top:0;background:var(--panel);z-index:1}
.resource-list .row,#dataBody:not(.table-view) tbody td,.sas-tbl td{border-bottom:0}
.storage-pager{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 0;flex:none;font-size:12px;color:var(--text-3)}
.storage-pager .page-note{margin-left:auto;font-size:11px}
.entity-viewport{position:relative;overflow:auto;min-height:240px;flex:1;contain:strict;overflow-anchor:none;border:1px solid var(--stroke);border-radius:5px}
.entity-spacer{position:relative}
.entity-window{position:absolute;left:0;top:0}
.entity-vrow{position:absolute;display:flex;height:40px}
.entity-vcell{box-sizing:border-box;width:160px;height:40px;padding:9px;font-size:12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;border-right:1px solid var(--stroke);border-bottom:1px solid var(--stroke)}
.entity-vhead{position:absolute;display:flex;height:36px;background:var(--panel);z-index:2}
.entity-vhead .entity-vcell{height:36px;color:var(--text-3);background:var(--panel);text-transform:none}
th,.xtbl th,.ask-abody th,.resource-list-header{text-transform:none;letter-spacing:normal}
.storage-pager{display:flex;align-items:center;gap:8px}
.page-count{margin-right:auto;color:var(--text-3)}
.page-buttons{display:flex;align-items:center;gap:5px}
.page-buttons button{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;padding:4px}
.page-buttons button[hidden]{display:none}
.page-buttons svg{width:16px;height:16px}
.entity-vhead .entity-vcell,.resource-list-header{font-size:11px;font-weight:400;color:var(--text-3);background:var(--panel)}
.resource-list-header{height:36px;box-sizing:border-box;align-items:center}
.resource-list table{width:100%;border-collapse:collapse;background:transparent}
.resource-list th{height:36px;box-sizing:border-box;padding:6px 9px;font-size:11px;font-weight:400;background:var(--panel);position:sticky;top:0;z-index:1}
.resource-list td{height:40px;box-sizing:border-box;padding:9px;font-size:12px;color:var(--text);background:transparent;vertical-align:middle}
.resource-list tbody tr:hover{background:var(--surface-2)}
.resource-list .row.sel,.resource-list tr:has(input:checked),.entity-vrow[aria-selected="true"]{background:var(--surface-2);box-shadow:inset 2px 0 0 var(--accent)}
.entity-vrow:hover{background:var(--surface-2)}
.resource-list .message-id{font:inherit;color:var(--text);white-space:nowrap}
.resource-list td .resource-delete{vertical-align:middle}
.resource-context{margin:4px 0;gap:4px}
.resource-path .backlink{width:28px;height:28px;padding:5px;box-sizing:border-box}
.resource-path .backlink svg{width:16px;height:16px}
.resource-path .backlink:disabled{opacity:.45;cursor:default}
.page-buttons button[aria-busy="true"] svg{animation:sp .8s linear infinite}
@media(prefers-reduced-motion:reduce){.page-buttons button[aria-busy="true"] svg{animation:none}}
.entity-viewport+.storage-pager{flex:none}
.entity-vrow:focus-visible{outline:2px solid var(--color-focus-outline,var(--accent));outline-offset:-2px}
.resource-list-count{padding:4px 9px;color:var(--text-3);font-size:11px}
.resource-list.contents .resource-list-header,.resource-list.contents .row{display:grid;grid-template-columns:minmax(120px,1fr) 80px 150px;gap:8px;padding-left:9px;padding-right:9px}
.resource-list.contents .item-size{text-align:right}
.resource-list.contents .item-date{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.resource-list.contents .item-actions{display:flex;justify-content:center}
.svcbar,.card .seg:has(label){display:flex;padding:0;border:0;border-bottom:1px solid var(--stroke);border-radius:0;background:transparent;box-shadow:none}
.svcbar>.seg,.card .seg label{position:relative;flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;margin:0;min-height:32px;padding:5px 8px;border:0;border-radius:0;border-right:1px solid var(--stroke);background:transparent;color:var(--text-2);font:inherit;font-size:12px;box-shadow:none;white-space:nowrap}
.svcbar>.seg:last-child,.card .seg label:last-child{border-right:0}
.svcbar>.seg:hover,.card .seg label:hover{background:var(--surface-2);color:var(--text)}
.svcbar>.seg.act,.card .seg label:has(input:checked){background:transparent;color:var(--text);font-weight:400;box-shadow:inset 0 -2px 0 var(--accent)}
.svcbar>.seg:focus-visible,.card .seg label:has(input:focus-visible){outline:2px solid var(--color-focus-outline,var(--accent));outline-offset:-4px}
.seg.act .segn,.segn{background:transparent;color:var(--text-3);border:0;font-weight:400}
.card .field>label,.card .xlbl,.card .xsrc-lbl,.card .xpolicy,.card .xm-l,.card .plabel,.card .sasm .c span,.card .acthdr span,.card .askchip-lbl,.card .metric .mk,.card .sect,.sgfield .sglabel,.entprops-head span{font-family:inherit;text-transform:none;letter-spacing:normal;font-weight:400;font-size:12px}
.card .sasrow input{font-family:inherit}
.xradio{display:flex;flex-wrap:wrap;gap:8px 20px;margin:6px 0 10px}
.xradio label{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font:inherit;color:var(--text-2)}
.xradio input{position:static;opacity:1;pointer-events:auto;width:16px;height:16px;margin:0;accent-color:var(--accent);flex:none}
.xradio input:focus-visible{outline:2px solid var(--color-focus-outline,var(--accent));outline-offset:2px}
@media(max-width:600px){.resource-list.contents .resource-list-header,.resource-list.contents .row{grid-template-columns:minmax(100px,1fr) 65px 115px;gap:6px}.resource-list.contents{overflow:auto}.appbar{flex-wrap:wrap;gap:6px;padding:8px}.appbar h1{font-size:14px}.appbar .build-stamp{flex-direction:column;align-items:flex-start;gap:0;font-size:10px}.appbar .feedback-link{margin-left:auto;padding:3px;font-size:11px}}
@media(max-width:600px){
  .shell{grid-template-columns:minmax(160px,40%) minmax(0,1fr)}
  .main{padding:12px 10px 40px}
  .card-head{padding:10px;gap:6px}
  .card-body{padding:10px}
  .svcbar{flex-wrap:wrap}
  .ctx{display:flex}
}
`,BODY=`
<div class="appbar">
  <div class="logo" aria-hidden="true">${AZURE_BRAND_ICON}</div>
  <h1>Azure Storage</h1>
  <!--BUILD-STAMP-->
  <div class="spacer"></div>
  <!--FEEDBACK-->
</div>
<div id="err"></div>
<div class="shell" id="shell">
  <aside class="side" id="side">
    <div class="side-head">
      <div class="side-heading"><span class="t">Storage Explorer</span><span class="chip" id="statusChip">starting\u2026</span></div>
      <button class="iconbtn" id="sideToggle" title="Collapse panel">${uiIcon("collapse",{size:16})}</button>
    </div>
    <div class="side-rail" id="sideRail"></div>
    <div class="side-tools">
      <div class="search"><span class="mag">${uiIcon("search",{size:16})}</span><input id="treeSearch" placeholder="Search tenants, subscriptions, accounts\u2026"></div>
      <div class="side-toolbar" role="toolbar" aria-label="Explorer controls"><button id="visibilityBtn" title="Choose visible tenants and subscriptions">View</button><button class="iconbtn" id="refreshBtn" title="Refresh subscriptions">${uiIcon("refresh",{size:16})}</button></div>
    </div>
    <div class="side-body">
      <div id="tree" class="tree"></div>
    </div>
  </aside>
  <main class="main">
    <div class="mainwrap">
      <div class="resource-pane" data-card="data" id="dataCard">
        <div class="resource-head" hidden><h2><span class="dti" id="dataTitleIc"></span> <span id="dataTitleTxt"></span> <span class="badge" id="dataCount"></span></h2></div>
        <div class="resource-body"><div id="svcBar"></div><div id="dataBody"></div><div id="resourceAnnotation"></div></div>
      </div>

      <div id="xfer" class="xfer" style="display:none"></div>

      <div class="card min" data-card="stats">
        <div class="card-head"><h2><span class="hicon">${uiIcon("statistics",{size:15})}</span> Filter &amp; statistics</h2><span class="cw">${uiIcon("down")}</span></div>
        <div class="card-body">
          <div class="filterbar">
          <div class="fgrid">
            <div class="field"><label>Name pattern</label><input id="fName" placeholder="e.g. logs/*.json"></div>
            <div class="field"><label>Min size (bytes)</label><input id="fMin" type="number" placeholder="any"></div>
            <div class="field"><label>Max size (bytes)</label><input id="fMax" type="number" placeholder="any"></div>
            <div class="field"><label>Older than (days)</label><input id="fOlder" type="number" placeholder="any"></div>
            <div class="field"><label>Newer than (days)</label><input id="fNewer" type="number" placeholder="any"></div>
            <div class="field"><label>Content type</label>
              <select id="fType"><option value="all">any type</option><option>image</option><option>video</option><option>audio</option><option>text/data</option><option>document</option><option>archive</option><option>binary</option></select>
            </div>
            <div class="field"><label>Access tier</label>
              <select id="fTier"><option value="">any tier</option><option>Hot</option><option>Cool</option><option>Cold</option><option>Archive</option></select>
            </div>
            <div class="field"><label>Blob type</label>
              <select id="fBlobType"><option value="">any blob type</option><option>BlockBlob</option><option>PageBlob</option><option>AppendBlob</option></select>
            </div>
            <div class="field"><label>Tag</label><input id="fTag" placeholder="key or key=value"></div>
          </div>
          <div class="factions">
            <button class="primary" id="filterBtn">${uiIcon("filter",{size:16})} Filter</button>
            <button class="ghost" id="dlFilteredBtn" title="Download blobs matching the applied filter">${uiIcon("download",{size:16})} Download</button>
            <button class="ghost" id="archiveFilteredBtn" title="Move the matched blobs to the Archive tier to cut cost (reversible)">${uiIcon("archive",{size:16})} Clean up (Archive)</button>
            <button class="ghost danger-ghost" id="deleteFilteredBtn" title="Permanently delete blobs matching the applied filter">${uiIcon("trash",{size:16})} Delete</button>
            <span class="grow"></span>
            <button class="accent" id="insightBtn" title="Ask Copilot to interpret these statistics"><span class="cpdot"></span> Explain these statistics</button>
          </div>
          </div>
          <div id="stats"></div>
          <div id="insight"></div>
        </div>
      </div>


      <div class="card min" data-card="share">
        <div class="card-head"><h2><span class="hicon">${uiIcon("link",{size:16})}</span> Share</h2><span class="cw">${uiIcon("down")}</span></div>
        <div class="card-body"><p class="card-sub">Create a time-limited SAS link for the open blob container. Choose permissions and expiration before creating the link.</p><button id="hubSasBtn">Create container SAS link</button></div>
      </div>

      <div class="card min" data-card="sas">
        <div class="card-head"><h2><span class="hicon g-sas">${uiIcon("link",{size:16})}</span> Instant SAS</h2> <span class="cw">${uiIcon("down")}</span></div>
        <div class="card-body">
          <div class="filterbar">
            <div class="field"><label>Container SAS URL</label>
              <div class="sasrow">
                <input id="sasIn" placeholder="https://account.blob.core.windows.net/container?sv=\u2026&amp;sig=\u2026">
                <button class="primary" id="sasBtn">${uiIcon("move",{size:16})} Connect</button>
              </div>
            </div>
            <div class="fbhint">Paste a container SAS URL for an Explorer-style read view: list, filter, inspect sizes/tiers and download, all from the SAS alone. No Azure sign-in required.</div>
          </div>
          <div id="sas" style="margin-top:12px"></div>
        </div>
      </div>

      <div class="card min" data-card="transfer">
        <div class="card-head"><h2><span class="hicon g-xfer">${uiIcon("transfer",{size:15})}</span> Transfer</h2> <span class="cw">${uiIcon("down")}</span></div>
        <div class="card-body">
          <p class="card-sub">Preview an AzCopy copy between containers using loaded accounts or container SAS URLs. Review conflicts and get the exact <b>azcopy</b> command. Nothing moves until you run it yourself.</p>
          <div class="filterbar">
            <div class="field"><label>Source</label>
              <div class="xradio" role="radiogroup" aria-label="Source input type"><label><input type="radio" name="xsrcmode" value="pick" checked>Account/container</label><label><input type="radio" name="xsrcmode" value="sas">SAS URL</label></div>
              <div id="xsrcpick"><div class="xdestpick"><select id="xsrcacct" aria-label="Source account"></select><span class="xdestslash">/</span><select id="xsrcsel" aria-label="Source container"></select></div><div id="xsrc" class="xsrc"></div></div>
              <div id="xsrcpaste" hidden><input id="xsrcsas" type="password" autocomplete="off" aria-label="Source container SAS URL" placeholder="Container SAS URL (Read and List permissions)"></div>
            </div>
            <div class="field" style="margin-top:10px"><label>Destination</label>
              <div class="xradio" role="radiogroup" aria-label="Destination input type"><label><input type="radio" name="xdestmode" value="pick" checked>Account/container</label><label><input type="radio" name="xdestmode" value="paste">SAS URL</label></div>
              <div id="xdestpick" class="xdestpick"><select id="xdestAcct" title="Destination account"></select><span class="xdestslash">/</span><select id="xdestCont" title="Destination container"></select></div>
              <div id="xdestpaste" style="display:none"><input id="xdest" type="password" autocomplete="off" aria-label="Destination container SAS URL" placeholder="Container SAS URL (List and Write permissions)"></div>
            </div>
            <div class="field" style="margin-top:10px"><label>When a file already exists at the destination</label>
              <div class="xradio" role="radiogroup" aria-label="Duplicate handling">
                <label><input type="radio" name="xres" value="overwrite" checked>Overwrite</label>
                <label><input type="radio" name="xres" value="skip">Skip existing</label>
                <label><input type="radio" name="xres" value="if-newer">If source newer</label>
              </div>
            </div>
            <div class="factions">
              <button class="primary" id="xplanBtn">${uiIcon("plan",{size:16})} Plan transfer</button>
              <span class="grow"></span>
              <label class="check" title="Apply Filter &amp; statistics criteria to every blob directly in the open folder, including items beyond the displayed list. Search items does not set transfer criteria."><input type="checkbox" id="xfiltered"> Only matching blobs in the open folder</label>
            </div>
          </div>
          <div id="transfer" style="margin-top:12px"></div>
        </div>
      </div>

    </div>
  </main>
</div>
<details class="debug-panel" id="debugPanel">
  <summary>Debug log</summary>
  <div id="log" class="log" tabindex="0" aria-label="Debug diagnostics"></div>
</details>
<!--FOOTER-->

<div class="overlay" id="visibilityOverlay">
  <div class="dialog">
    <div class="dlg-head"><h3>Visible directories and subscriptions</h3><button id="visibilityClose" class="iconbtn" aria-label="Close">${uiIcon("clear")}</button></div>
    <p class="visibility-copy">Choose what appears in the Explorer. This does not change Azure access or sign you in.</p>
    <div class="visibility-tools"><input id="visibilitySearch" type="search" aria-label="Filter directories and subscriptions" placeholder="Filter directories and subscriptions"><button id="visibilitySelectAll" title="Select all shown directories and subscriptions">Select all</button><button id="visibilityClearAll" title="Clear shown directories and subscriptions">Clear</button></div>
    <div id="visibilityList" class="dlg-list"></div>
    <div class="dlg-foot"><span></span><button id="visibilityApply" class="primary">Apply</button></div>
  </div>
</div>

<div class="overlay" id="confirmOverlay">
  <div class="dialog" style="width:min(440px,92vw)">
    <div class="dlg-head"><div><h3 id="cfTitle">Confirm</h3><p class="dlg-sub" id="cfMsg"></p></div></div>
    <div id="cfInputWrap" style="display:none;padding:6px 20px 0"><textarea id="cfInput" rows="1" style="width:100%;background:var(--surface);border:1px solid var(--stroke-2);border-radius:10px;padding:9px 12px;color:var(--text);font:13px/1.5 ui-monospace,monospace;outline:none;resize:vertical"></textarea><div id="cfError" role="alert" class="dlg-err"></div></div>
    <div class="dlg-foot"><span></span><div class="flex" style="gap:8px"><button id="cfCancel">Cancel</button><button id="cfOk" class="primary">OK</button></div></div>
  </div>
</div>

<div class="overlay" id="entityOverlay">
  <div class="dialog" style="width:min(580px,94vw)">
    <div class="dlg-head"><div><h3 id="entTitle">Add entity</h3><p class="dlg-sub">PartitionKey and RowKey identify the entity. Add any number of typed properties.</p></div><button class="iconbtn" id="entClose" title="Close">${uiIcon("clear")}</button></div>
    <div style="padding:6px 20px 0">
      <div class="entgrid">
        <label class="entfield"><span>PartitionKey</span><input id="entPK" placeholder="e.g. orders"></label>
        <label class="entfield"><span>RowKey</span><input id="entRK" placeholder="e.g. 1001"></label>
      </div>
      <div class="entprops-head"><span>Properties</span><button class="linkbtn" id="entAddProp">${uiIcon("add")} Add property</button></div>
      <div id="entProps"></div>
    </div>
    <div class="dlg-foot"><span id="entErr" class="dlg-err"></span><div class="flex" style="gap:8px"><button id="entCancel">Cancel</button><button id="entSave" class="primary">Save entity</button></div></div>
  </div>
</div>

<div class="overlay" id="sasOverlay">
  <div class="dialog" style="width:min(600px,94vw)">
    <div class="dlg-head"><div><h3 id="sgTitle">Create SAS link</h3><p class="dlg-sub" id="sgSub">A secure, time-limited URL. No Azure login needed to use it.</p></div><button class="iconbtn" id="sgClose" title="Close">${uiIcon("clear")}</button></div>
    <div style="padding:8px 20px 0">
      <div class="sgfield"><span class="sglabel">What can the link do?</span>
        <div class="sgperms">
          <label class="sgperm"><input type="checkbox" id="sgpR" checked><span class="sgpttl">Read</span><span class="sgpdesc">view &amp; download</span></label>
          <label class="sgperm" id="sgpLwrap" style="display:none"><input type="checkbox" id="sgpL"><span class="sgpttl">List</span><span class="sgpdesc">browse contents</span></label>
          <label class="sgperm"><input type="checkbox" id="sgpW"><span class="sgpttl">Write</span><span class="sgpdesc">upload / overwrite</span></label>
          <label class="sgperm"><input type="checkbox" id="sgpD"><span class="sgpttl">Delete</span><span class="sgpdesc">remove content</span></label>
        </div>
      </div>
      <div class="sgfield"><span class="sglabel">Expires in</span>
        <div class="sgexp">
          <button type="button" class="sgchip" data-min="60">1 hour</button>
          <button type="button" class="sgchip active" data-min="1440">24 hours</button>
          <button type="button" class="sgchip" data-min="10080">7 days</button>
          <button type="button" class="sgchip" data-min="43200">30 days</button>
        </div>
      </div>
      <div id="sgResult" class="sgresult" style="display:none"></div>
    </div>
    <div class="dlg-foot"><span id="sgErr" class="dlg-err"></span><div class="flex" style="gap:8px"><button id="sgCancel">Close</button><button id="sgGo" class="primary">Generate link</button></div></div>
  </div>
</div>
`,CLIENT=`
${humanErrorSummary.toString()}
const UI_ICONS=${JSON.stringify(UI_ICONS)};
${uiIcon.toString()}
var RESOURCE_ICONS=${JSON.stringify(RESOURCE_ICONS)};
const $=function(id){return document.getElementById(id)};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function mdInline(s){
  var t=esc(s==null?'':s);
  var p=t.split('**');
  if(p.length>2&&p.length%2===1){var o='';for(var i=0;i<p.length;i++)o+=(i%2===1?'<strong>'+p[i]+'</strong>':p[i]);t=o}
  var bt=String.fromCharCode(96);
  var c=t.split(bt);
  if(c.length>2&&c.length%2===1){var o2='';for(var j=0;j<c.length;j++)o2+=(j%2===1?'<code>'+c[j]+'</code>':c[j]);t=o2}
  return t;
}
function fmtBytes(n){n=Number(n)||0;if(n<1024)return n+' B';var u=['KB','MB','GB','TB','PB'],i=-1;do{n/=1024;i++}while(n>=1024&&i<u.length-1);return n.toFixed(n>=10?0:1)+' '+u[i]}
var bridge={send:function(route,payload){return fetch(route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload||{})}).then(function(r){if(!r.ok)throw new Error('Canvas request failed: HTTP '+r.status);return r.json()}).catch(function(error){state.s_error=error.message;renderError();return{ok:false,error:error.message}})}};
var state={};var selected=new Set();var selectedFiles=new Set();
var openSubs={};
var treeQuery='';
function ascLoad(k){try{return JSON.parse(localStorage.getItem(k)||'null')||{}}catch(e){return{}}}
var hiddenTenants={},hiddenSubscriptions={};
var pinnedAccts=ascLoad('asc_pinned');
function saveAcctPrefs(){try{localStorage.setItem('asc_pinned',JSON.stringify(pinnedAccts))}catch(e){}try{bridge.send('/save-prefs',{pinned:pinnedAccts})}catch(e){}}
var activeSvc=null;var svcListMode=false;var lastAcct='';var lastItemKey='';var lastResourceKey='';var lastPrevName='';
var selectedRecords=new Set(),lastRecordsScope='',sasSelected=new Set(),sasSelectionScope='',sasDownloading=false;
var queueDrafts={};
function entityKey(row){return JSON.stringify([row.partitionKey,row.rowKey])}
var xSourceCont='';
var xSourceMode='pick';var xDestMode='pick';var xDestAcct='';var xDestCont='';var xDestReq={};
var resourceQueries={};
var sasFilterText='';var sasSort='name';

var es=new EventSource('/events');
es.onmessage=function(ev){try{var next=JSON.parse(ev.data);if(next.s_entitiesUnchanged)next.s_entities=state.s_entities;state=next}catch(e){return}render()};
(function(){bridge.send('/get-prefs',{}).then(function(r){if(r&&r.ok&&r.prefs){if(r.prefs.pinned)pinnedAccts=r.prefs.pinned;hiddenTenants=r.prefs.hiddenTenants||{};hiddenSubscriptions=r.prefs.hiddenSubscriptions||{};try{localStorage.setItem('asc_pinned',JSON.stringify(pinnedAccts))}catch(e){}if(typeof renderTree==='function')renderTree()}})})();

var lastFilterScope=null,lastFilterCriteria=null;
function render(){renderError();renderStatus();renderSeBtn();renderTree();renderData(true);renderBatch();syncAppliedFilter();renderStats();renderInsight();renderSas();renderTransferSrc();renderXDest();renderTransfer();renderAsk();renderLog();updateStoragePagers()}
function renderTransferSrc(){
  $('xsrcpick').hidden=xSourceMode!=='pick';$('xsrcpaste').hidden=xSourceMode!=='sas';
  $('xfiltered').disabled=xSourceMode==='sas';
  if(xSourceMode==='sas')$('xfiltered').checked=false;
  Array.prototype.forEach.call(document.getElementsByName('xsrcmode'),function(r){r.checked=r.value===xSourceMode;r.onchange=function(){if(r.checked){xSourceMode=r.value;renderTransferSrc();renderXDest()}}});
  if(xSourceMode==='sas')return;
  var sel=$('xsrcsel'),banner=$('xsrc');var acct=state.s_account;
  var sourceAccount=$('xsrcacct'),accts=(state.s_accounts||[]).map(function(x){return x.name}).sort();
  if(sourceAccount){
    sourceAccount.innerHTML=accts.map(function(n){return '<option value="'+esc(n)+'"'+(n===acct?' selected':'')+'>'+esc(n)+'</option>'}).join('')||'<option value="">Open an account first</option>';
    sourceAccount.disabled=!accts.length;sourceAccount.value=acct||'';
    sourceAccount.onchange=function(){xSourceCont='';bridge.send('/account',{account:sourceAccount.value})};
    selxEnhance(sourceAccount);
  }
  var tree=(state.s_tree||{})[acct]||{};var conts=tree.containers||[];
  var names=conts.map(function(c){return c.name});
  if(sel){
    if(!acct){sel.innerHTML='<option value="">Open a storage account first</option>';sel.disabled=true}
    else if(!names.length){sel.innerHTML='<option value="">No containers in this account</option>';sel.disabled=true}
    else{
      if(!xSourceCont||names.indexOf(xSourceCont)<0){xSourceCont=(state.s_container&&names.indexOf(state.s_container)>=0)?state.s_container:names[0]}
      sel.disabled=false;
      sel.innerHTML=names.map(function(n){return '<option value="'+esc(n)+'"'+(n===xSourceCont?' selected':'')+'>'+esc(n)+'</option>'}).join('');
      sel.value=xSourceCont;
    }
    sel.onchange=function(){xSourceCont=sel.value;renderTransferSrc();renderXDest()};
    selxEnhance(sel);
  }
  if(banner){
    if(!acct){banner.style.display='';banner.className='xsrc off';banner.innerHTML='<span class="xsrc-ic">'+svgIcon('blob')+'</span>Open a storage account in the Explorer to choose a source container.';return}
    if(!names.length){banner.style.display='';banner.className='xsrc off';banner.innerHTML='<span class="xsrc-ic">'+svgIcon('blob')+'</span>This account has no blob containers to transfer from.';return}
    banner.style.display='none';banner.innerHTML='';
  }
}
function renderXDest(){
  var mode=xDestMode;
  var pick=$('xdestpick'),paste=$('xdestpaste');
  if(pick)pick.style.display=mode==='pick'?'':'none';
  if(paste)paste.style.display=mode==='paste'?'':'none';
  Array.prototype.forEach.call(document.getElementsByName('xdestmode'),function(r){r.checked=(r.value===mode);r.onchange=function(){if(r.checked){xDestMode=r.value;renderXDest()}}});
  if(mode!=='pick')return;
  var accts=state.s_account?(state.s_accounts||[]).map(function(x){return x.name}):[];
  if(!state.s_account){xDestAcct='';xDestCont=''}
  var aSel=$('xdestAcct'),cSel=$('xdestCont');
  if(aSel){
    if(!accts.length){aSel.innerHTML='<option value="">No accounts loaded</option>';aSel.disabled=true}
    else{
      if(!xDestAcct||accts.indexOf(xDestAcct)<0){xDestAcct=state.s_account&&accts.indexOf(state.s_account)>=0?state.s_account:accts[0]}
      aSel.disabled=false;
      aSel.innerHTML=accts.map(function(n){return '<option value="'+esc(n)+'"'+(n===xDestAcct?' selected':'')+'>'+esc(n)+'</option>'}).join('');
      aSel.value=xDestAcct;
    }
    aSel.onchange=function(){xDestAcct=aSel.value;xDestCont='';renderXDest()};
    selxEnhance(aSel);
  }
  if(cSel){
    var tree=(state.s_tree||{})[xDestAcct]||{};var conts=tree.containers;
    if(!xDestAcct){cSel.innerHTML='<option value="">Select a container</option>';cSel.disabled=true}
    else if(conts==null){
      cSel.innerHTML='<option value="">loading\u2026</option>';cSel.disabled=true;
      if(!xDestReq[xDestAcct]){xDestReq[xDestAcct]=true;bridge.send('/tree-containers',{account:xDestAcct})}
    }
    else{
      var names=conts.map(function(c){return c.name}).filter(function(n){return !(xSourceMode==='pick'&&xDestAcct===state.s_account&&n===xSourceCont)});
      if(!names.length){cSel.innerHTML='<option value="">No other containers here</option>';cSel.disabled=true;xDestCont=''}
      else{
        if(!xDestCont||names.indexOf(xDestCont)<0)xDestCont=names[0];
        cSel.disabled=false;
        cSel.innerHTML=names.map(function(n){return '<option value="'+esc(n)+'"'+(n===xDestCont?' selected':'')+'>'+esc(n)+'</option>'}).join('');
        cSel.value=xDestCont;
      }
    }
    cSel.onchange=function(){xDestCont=cSel.value};
    selxEnhance(cSel);
  }
}
var selxOpen=null;
function selxCloseAll(){if(selxOpen){selxOpen.host.classList.remove('open');selxOpen.pop.classList.remove('show');selxOpen=null}}
function selxPlace(w){
  var r=w.btn.getBoundingClientRect(),p=w.pop;
  p.style.width=r.width+'px';p.style.left=r.left+'px';p.style.top='';p.style.bottom='';
  var spaceBelow=window.innerHeight-r.bottom-8,needed=Math.min(p.scrollHeight,260);
  if(spaceBelow<needed&&r.top-8>spaceBelow){p.style.bottom=(window.innerHeight-r.top+6)+'px'}
  else{p.style.top=(r.bottom+6)+'px'}
}
function selxToggle(w){if(selxOpen===w){selxCloseAll();return}selxCloseAll();w.host.classList.add('open');w.pop.classList.add('show');selxOpen=w;selxPlace(w)}
function selxRefresh(sel){
  var w=sel.__selx;if(!w)return;
  var cur=sel.options[sel.selectedIndex];
  w.btn.disabled=sel.disabled;w.lbl.textContent=cur?cur.textContent:'';
  var html='';for(var i=0;i<sel.options.length;i++){var o=sel.options[i];html+='<div class="selx-item'+(o.selected?' on':'')+'" data-i="'+i+'">'+uiIcon('check',{size:14})+'<span>'+esc(o.textContent)+'</span></div>'}
  w.pop.innerHTML=html;
  if(selxOpen===w)selxPlace(w);
}
function selxEnhance(sel){
  if(sel.__selx){selxRefresh(sel);return}
  var host=document.createElement('div');host.className='selx';
  sel.parentNode.insertBefore(host,sel);host.appendChild(sel);sel.classList.add('selx-native');
  var btn=document.createElement('button');btn.type='button';btn.className='selx-btn';
  var lbl=document.createElement('span');lbl.className='selx-txt';
  btn.appendChild(lbl);btn.insertAdjacentHTML('beforeend',uiIcon('down',{size:14,className:'selx-car'}));host.appendChild(btn);
  var pop=document.createElement('div');pop.className='selx-pop';document.body.appendChild(pop);
  var w={host:host,btn:btn,lbl:lbl,pop:pop,sel:sel};sel.__selx=w;
  btn.onclick=function(e){e.stopPropagation();if(sel.disabled)return;selxToggle(w)};
  pop.onclick=function(e){var it=e.target.closest('.selx-item');if(!it)return;var i=+it.getAttribute('data-i');if(sel.selectedIndex!==i){sel.selectedIndex=i;sel.dispatchEvent(new Event('change'))}selxCloseAll()};
  selxRefresh(sel);
}
document.addEventListener('click',function(e){if(selxOpen&&selxOpen.pop.contains(e.target))return;selxCloseAll()});
window.addEventListener('resize',function(){if(selxOpen)selxPlace(selxOpen)});
window.addEventListener('scroll',function(e){if(!selxOpen)return;if(selxOpen.pop.contains(e.target))return;var r=selxOpen.btn.getBoundingClientRect();if(r.bottom<4||r.top>window.innerHeight-4){selxCloseAll();return}selxPlace(selxOpen)},true);
function syncAppliedFilter(){
  var scope=JSON.stringify([state.s_account,state.s_kind,state.s_container,state.s_blobPrefix||'']);
  var criteria=state.s_kind==='blob'?state.s_criteria:null;
  var signature=JSON.stringify(criteria||{});
  if(scope===lastFilterScope&&signature===lastFilterCriteria)return;
  lastFilterScope=scope;lastFilterCriteria=signature;
  syncFilterForm(criteria);
}

function renderStatus(){
  var c=$('statusChip');if(!c)return;var a=state.s_accounts||[];
  if((state.s_accountsLoading||state.s_subsLoading)&&!a.length){c.className='chip';c.innerHTML=''+uiIcon('busy',{size:13,className:'spin'})+' loading\u2026';return}
  if(a.length){c.className='chip';c.textContent=a.length+(a.length===1?' loaded account':' loaded accounts');c.title='Accounts returned across loaded subscriptions, including hidden Explorer scopes.';return}
  if(state.s_signingIn){c.className='chip';c.innerHTML=''+uiIcon('busy',{size:13,className:'spin'})+' signing in\u2026';return}
  if(state.s_needsAuth){c.className='chip warn';c.textContent='not signed in';return}
  if(state.s_error){c.className='chip warn';c.textContent='error';return}
  c.className='chip';c.textContent='no accounts';
}
// The ASE hand-off is a quiet escape hatch, not a front door: muted/icon-only
// until a specific resource is open, then it emphasizes + labels itself because
// that is the moment a user might actually need bulk ops the canvas won't do.
function renderSeBtn(){
  var b=$('seOpenBtn');if(!b||b.disabled)return;
  var lbl=b.querySelector('.seopen-lbl');
  if(state.s_seInstalled===false){
    b.className='seopen on';
    if(lbl)lbl.textContent='Get Azure Storage Explorer';
    b.title='Azure Storage Explorer is not installed. Click to get the free desktop app.';
    return;
  }
  var itemOpen=!!(state.s_item&&state.s_kind&&!svcListMode);
  if(itemOpen){
    b.className='seopen on';
    if(lbl)lbl.textContent='Open in Azure Storage Explorer';
    b.title='Open '+state.s_item+' in the Azure Storage Explorer desktop app, for bulk upload, folders and full management.';
  }else{
    b.className='seopen';
    if(lbl)lbl.textContent='Open in Azure Storage Explorer';
    b.title=state.s_account?'Open this account in the Azure Storage Explorer desktop app':'Open the Azure Storage Explorer desktop app';
  }
}

// A contextual hand-off strip, shown only where the canvas reaches its own limits
// (nested folders, whole-folder or bulk upload, access tiers, metadata, snapshots).
// The button label flips to "Get" when we know the desktop app is not installed.
function seCtaHtml(title,msg){
  var absent=state.s_seInstalled===false;
  var lab=absent?'Get Azure Storage Explorer':'Open in Azure Storage Explorer';
  return '<div class="secta"><span class="secta-ic">'+uiIcon('explorer',{size:22})+'</span><div class="secta-tx"><b>'+esc(title)+'</b><span>'+esc(msg)+'</span></div><button class="secta-btn" data-seopen="1">'+uiIcon('explorer',{size:15})+lab+'</button></div>';
}

// Launch the desktop app (or its download page when absent). Shared by the
// toolbar button and every contextual hand-off strip.
function openSE(){
  var b=$('seOpenBtn');
  if(b){b.disabled=true;b.classList.add('on');var l=b.querySelector('.seopen-lbl');if(l)l.textContent='Opening\u2026';}
  Promise.resolve(bridge.send('/open-storage-explorer',{})).catch(function(){}).then(function(){
    setTimeout(function(){if(b)b.disabled=false;renderSeBtn()},1200);
  });
}

// Wire any data-seopen buttons inside a freshly-rendered element to openSE().
function wireSeCta(el){
  if(!el)return;
  Array.prototype.forEach.call(el.querySelectorAll('[data-seopen]'),function(btn){btn.onclick=function(e){e.stopPropagation();openSE()}});
}

function renderError(){
  var e=$('err');if(!e)return;
  if(state.s_signingIn){e.innerHTML='<div class="err err-auth"><span class="etext">'+uiIcon('busy',{size:13,className:'spin'})+' Opening az login\u2026 complete the sign-in in your browser window.</span></div>';return}
  if(!state.s_error){e.innerHTML='';return}
  var authBtn=state.s_needsAuth?'<button class="ebtn" id="errSignin">Sign in</button>':'';
  var failures=state.s_subscriptionErrors||[];
  var summary=failures.length?failures.length+' subscription(s) could not be read. Check the affected subscriptions in the Explorer.':humanErrorSummary(state.s_error,state.s_needsAuth);
  var context=state.s_account&&!failures.length?state.s_account+': ':'';
  e.innerHTML='<div class="err'+(state.s_needsAuth?' err-auth':'')+'"><div class="etext">'+esc(context+summary)+' <button class="diagnostics-link" data-debug-log="1">Open diagnostics</button></div><span class="eact">'+authBtn+'<button class="eclose" id="errClose" title="Dismiss">'+uiIcon('clear')+'</button></span></div>';
  wireDiagnostics(e);
  var s=$('errSignin');if(s)s.onclick=function(){doSignin()};
  var b=$('errClose');if(b)b.onclick=function(){state.s_error=null;state.s_needsAuth=false;renderError();bridge.send('/dismiss-error',{})};
}
function doSignin(){state.s_signingIn=true;renderError();var p=bridge.send('/sign-in',{});if(p&&p.then)p.then(function(r){state.s_signingIn=false;if(r&&r.ok===false)renderError()})}

function svgIcon(kind){
  if(kind==='tenant')return ${JSON.stringify(TENANT_ICON)};
  return '<img class="svi" alt="" src="'+('data:image/svg+xml,'+encodeURIComponent(RESOURCE_ICONS[kind]||RESOURCE_ICONS.blob))+'">';
}
function resourcePath(kind,item){
  var path='<div class="resource-path"><button class="backlink" id="svcBack" aria-label="Back" title="Back">'+uiIcon('back')+'</button>';
  if(kind==='blob'){
    path+='<button class="path-link" data-blob-path="">'+esc(item)+'</button>';
    var prefix=state.s_blobPrefix||'',offset=0;
    prefix.split('/').slice(0,-1).forEach(function(part){offset+=part.length+1;path+='<span aria-hidden="true">/</span><button class="path-link" data-blob-path="'+esc(prefix.slice(0,offset))+'">'+esc(part||'(empty segment)')+'</button>'});
    return path+'</div>';
  }
  if(kind!=='file')return path+'<span class="path-name" title="'+esc(item)+'">'+esc(item)+'</span></div>';
  path+='<button class="path-link" data-file-path="">'+esc(item)+'</button>';
  var parts=(state.s_fileDir||'').split('/').filter(Boolean);
  parts.forEach(function(part,index){path+='<span aria-hidden="true">/</span><button class="path-link" data-file-path="'+esc(parts.slice(0,index+1).join('/'))+'">'+esc(part)+'</button>'});
  return path+'</div>';
}
function searchControl(id,label,value){
  return '<div class="search"><span class="mag">'+uiIcon('search')+'</span><input id="'+id+'" type="search" aria-label="'+esc(label)+'" title="Search the currently loaded page" placeholder="'+esc(label)+'" value="'+esc(value||'')+'"></div>';
}
function fitResourcePath(){
  var path=$('dataBody').querySelector('.resource-path');if(!path)return;
  var width=path.clientWidth;if(path.dataset.fitWidth===String(width))return;path.dataset.fitWidth=String(width);
  var old=path.querySelector('.path-overflow');if(old)old.remove();
  var children=Array.prototype.slice.call(path.children);if(!children.length)return;
  children.forEach(function(el){el.hidden=false;el.classList.remove('path-current')});
  var current=children[children.length-1];current.classList.add('path-current');
  current.title=current.getAttribute('data-blob-path')||current.getAttribute('data-file-path')||current.textContent.trim();
  var ancestors=children.filter(function(el){return el.tagName==='BUTTON'&&el!==current&&!el.classList.contains('backlink')});
  if(!ancestors.length)return;
  var overflow=document.createElement('details');overflow.className='path-overflow';overflow.hidden=true;
  overflow.innerHTML='<summary aria-label="Earlier locations" title="Earlier locations">'+uiIcon('more')+'</summary><div class="path-overflow-menu"></div>';
  var back=path.querySelector('.backlink');path.insertBefore(overflow,back?back.nextSibling:path.firstChild);
  var menu=overflow.querySelector('.path-overflow-menu');
  ancestors.forEach(function(button){
    if(path.scrollWidth<=path.clientWidth&&current.clientWidth>=Math.min(120,current.scrollWidth))return;
    overflow.hidden=false;button.hidden=true;
    var separator=button.previousElementSibling;if(separator&&separator.tagName==='SPAN')separator.hidden=true;
    var choice=button.cloneNode(true);choice.hidden=false;choice.removeAttribute('id');choice.removeAttribute('data-blob-path');choice.removeAttribute('data-file-path');
    choice.title=button.getAttribute('data-blob-path')||button.getAttribute('data-file-path')||button.textContent.trim();
    choice.onclick=function(){overflow.open=false;button.click()};menu.appendChild(choice);
  });
}
new ResizeObserver(fitResourcePath).observe($('dataBody'));
function resourceList(rows,count,contents){
  var header=contents?'<span>Name</span><span class="item-size">Size</span><span>Last modified</span>':'<span>Name</span>';
  return '<div class="resource-list'+(contents?' contents':'')+'" role="region" aria-label="Resource items"><div class="resource-list-header">'+header+'</div><div class="list">'+rows+'</div></div>';
}
function acctNode(x){
  var pinned=!!pinnedAccts[x.name];
  var h='<div class="tnode">';
  h+='<div class="trow'+(state.s_account===x.name?' sel':'')+'" data-acct="'+esc(x.name)+'"><span class="tw"></span><span class="ti">'+svgIcon('account')+'</span><span class="tlabel">'+esc(x.name)+'</span>'+(x.location?'<span class="tmeta">'+esc(x.location)+'</span>':'')+'<button class="pinbtn'+(pinned?' on':'')+'" data-pin="'+esc(x.name)+'" title="'+(pinned?'Unpin':'Pin to top')+'" aria-label="'+(pinned?'Unpin ':'Pin ')+esc(x.name)+'">'+uiIcon('pin')+'</button></div>';
  h+='</div>';
  return h;
}

var openTenants={};
var lastTreeKey='';
function treeRenderKey(){
  function failure(f){return f?[f.message||f.error,!!f.needsAuth]:null}
  return JSON.stringify([treeQuery,pinnedAccts,hiddenTenants,hiddenSubscriptions,openTenants,openSubs,
    state.s_account,!!state.s_accountsLoading,!!state.s_subsLoading,state.s_tenantLoading,state.s_tenantInventoryError,
    (state.s_accounts||[]).map(function(a){return[a.name,a.subscriptionId,a.subscriptionName,a.tenantId,a.location]}),
    (state.s_subscriptions||[]).map(function(s){return[s.subscriptionId,s.tenantId,s.displayName]}),
    (state.s_tenants||[]).map(function(t){return[t.tenantId,t.displayName,t.defaultDomain,t.current]}),
    state.s_selectedSubs||[],Object.keys(state.s_tenantErrors||{}).sort().map(function(t){return[t,failure(state.s_tenantErrors[t])]}),
    (state.s_subscriptionErrors||[]).map(function(e){return[e.subscriptionId,failure(e)]})]);
}
function renderTree(){
  var el=$('tree');var a=state.s_accounts||[];
  var key=treeRenderKey();if(key===lastTreeKey)return;lastTreeKey=key;
  var scroller=el.closest('.side-body'),scrollTop=scroller.scrollTop,focused=document.activeElement,focusKey=null;
  if(el.contains(focused)){['data-pin','data-acct','data-sub','data-tenant','data-signin-tenant'].some(function(attr){var node=focused.closest('['+attr+']');if(node){focusKey=[attr,node.getAttribute(attr)];return true}return false})}
  var sel=state.s_selectedSubs||[];
  var subs=state.s_subscriptions||[];
  if(!subs.length&&!(state.s_tenants||[]).length){el.innerHTML='<div class="tempty">'+(state.s_subsLoading?'Loading tenants and subscriptions\u2026':'No subscriptions available. Use Refresh to read your Azure CLI accounts.')+'</div>';return}
  var q=treeQuery.toLowerCase();
  function matchAcct(x){return !q||x.name.toLowerCase().indexOf(q)>=0||(x.subscriptionName||'').toLowerCase().indexOf(q)>=0||(x.tenantId||'').toLowerCase().indexOf(q)>=0}
  var html='';
  if(state.s_tenantInventoryError)html+=failureHtml({message:'Current directory inventory unavailable; showing cached directories.',error:state.s_tenantInventoryError},'');
  function scopeVisible(x){return !hiddenTenants[x.tenantId]&&!hiddenSubscriptions[x.subscriptionId]}
  var pins=a.filter(function(x){return scopeVisible(x)&&pinnedAccts[x.name]&&matchAcct(x)});
  if(pins.length){
    html+='<div class="tnode"><div class="trow pinhdr"><span class="tw"></span><span class="ti">'+uiIcon('pin')+'</span><span class="tlabel">Pinned</span><span class="tmeta">'+pins.length+'</span></div><div class="tchildren">';
    pins.forEach(function(x){html+=acctNode(x)});
    html+='</div></div>';
  }
  var tenants={};(state.s_tenants||[]).forEach(function(t){tenants[t.tenantId]=[]});
  subs.forEach(function(s){var t=s.tenantId||'Unknown tenant';(tenants[t]||(tenants[t]=[])).push(s)});
  Object.keys(tenants).sort().forEach(function(t){
    if(hiddenTenants[t])return;
    var info=(state.s_tenants||[]).find(function(x){return x.tenantId===t})||{displayName:'Cached directory'};
    var shown=tenants[t].filter(function(s){return !hiddenSubscriptions[s.subscriptionId]&&(!q||(info.displayName||'').toLowerCase().indexOf(q)>=0||t.toLowerCase().indexOf(q)>=0||(s.displayName||'').toLowerCase().indexOf(q)>=0||s.subscriptionId.toLowerCase().indexOf(q)>=0||a.some(function(x){return x.subscriptionId===s.subscriptionId&&matchAcct(x)}))});
    if(q&&!shown.length&&(info.displayName||'').toLowerCase().indexOf(q)<0)return;
    var to=!!q||(openTenants[t]===undefined?tenants[t].length>0:openTenants[t]);
    html+='<div class="tnode"><div class="trow" data-tenant="'+esc(t)+'" role="button" tabindex="0" aria-expanded="'+to+'"><span class="tw'+(to?' open':'')+'">'+uiIcon('forward')+'</span><span class="ti">'+svgIcon('tenant')+'</span><span class="tlabel" title="'+esc((info.defaultDomain||'')+' '+t)+'">'+esc(info.displayName)+'</span><span class="tmeta">'+shown.length+'</span></div>';
    if(to){html+='<div class="tchildren">';
      if(info.current===false)html+='<div class="tempty">Cached directory; current access is unverified.</div>';
      if(state.s_tenantLoading===t)html+='<div class="tempty">Loading subscriptions\u2026</div>';
      else if(!shown.length&&!((state.s_tenantErrors||{})[t]))html+='<div class="tempty">No subscriptions available.</div>';
      var tenantFailure=(state.s_tenantErrors||{})[t];if(tenantFailure)html+=failureHtml(tenantFailure,t);
      shown.sort(function(x,y){return (x.displayName||'').localeCompare(y.displayName||'')}).forEach(function(s){
        var selected=sel.indexOf(s.subscriptionId)>=0;
        var accts=a.filter(function(x){return x.subscriptionId===s.subscriptionId&&!pinnedAccts[x.name]&&matchAcct(x)});
        var so=!!q||(openSubs[s.subscriptionId]===undefined?selected:openSubs[s.subscriptionId]);
        var failure=(state.s_subscriptionErrors||[]).find(function(e){return e.subscriptionId===s.subscriptionId});
        html+='<div class="tnode"><div class="trow" data-sub="'+esc(s.subscriptionId)+'" role="button" tabindex="0" aria-expanded="'+so+'"><span class="tw'+(so?' open':'')+'">'+uiIcon('forward')+'</span><span class="ti">'+svgIcon('sub')+'</span><span class="tlabel" title="'+esc(s.subscriptionId)+'">'+esc(s.displayName||s.subscriptionId)+'</span><span class="tmeta">'+(selected?(state.s_accountsLoading?uiIcon('busy'):failure?uiIcon('warning'):accts.length):'')+'</span></div>';
        if(so){html+='<div class="tchildren">';
          if(selected&&state.s_accountsLoading)html+='<div class="tempty">'+uiIcon('busy',{size:13,className:'spin'})+' Loading accounts\u2026</div>';
          else if(failure)html+=failureHtml(failure,s.tenantId);
          else if(selected&&!accts.length)html+='<div class="tempty">Azure returned no storage accounts in this subscription.</div>';
          else accts.forEach(function(x){html+=acctNode(x)});
          html+='</div>';
        }html+='</div>';
      });html+='</div>';
    }html+='</div>';
  });
  el.innerHTML=html||'<div class="tempty">No matches.</div>';
  wireDiagnostics(el);
  Array.prototype.forEach.call(el.querySelectorAll('[data-signin-tenant]'),function(b){b.onclick=function(){bridge.send('/sign-in',{tenantId:b.getAttribute('data-signin-tenant')})}});
  Array.prototype.forEach.call(el.querySelectorAll('[data-tenant]'),function(r){r.onclick=function(){var t=r.getAttribute('data-tenant');openTenants[t]=r.getAttribute('aria-expanded')!=='true';if(openTenants[t]&&!tenants[t].length){bridge.send('/tenant-subscriptions',{tenantId:t})}renderTree()}});
  Array.prototype.forEach.call(el.querySelectorAll('[data-sub]'),function(r){
    var id=r.getAttribute('data-sub');
    r.onclick=function(){
      openSubs[id]=sel.indexOf(id)<0||r.getAttribute('aria-expanded')!=='true';
      if(openSubs[id]&&sel.indexOf(id)<0){
        var ids=(state.s_selectedSubs||[]).concat(id);
        state.s_selectedSubs=ids;state.s_loading=true;state.s_accountsLoading=true;
        bridge.send('/select-subscriptions',{subscriptionIds:ids});
      }
      renderTree();
    };
  });
  Array.prototype.forEach.call(el.querySelectorAll('.trow[role="button"]'),function(r){r.onkeydown=function(e){if(e.target===r&&(e.key==='Enter'||e.key===' ')){e.preventDefault();r.click()}}});
  Array.prototype.forEach.call(el.querySelectorAll('[data-acct]'),function(r){r.onclick=function(){bridge.send('/account',{account:r.getAttribute('data-acct')})}});
  Array.prototype.forEach.call(el.querySelectorAll('[data-pin]'),function(r){r.onclick=function(e){e.stopPropagation();var n=r.getAttribute('data-pin');if(pinnedAccts[n])delete pinnedAccts[n];else pinnedAccts[n]=1;saveAcctPrefs();renderTree()}});
  Array.prototype.forEach.call(el.querySelectorAll('.trow'),function(r){if(!r.onclick)return;r.setAttribute('role','button');r.tabIndex=0;r.onkeydown=function(e){if(e.target===r&&(e.key==='Enter'||e.key===' ')){e.preventDefault();r.click()}}});
  if(focusKey){var replacement=el.querySelector('['+focusKey[0]+'="'+CSS.escape(focusKey[1])+'"]');if(replacement)replacement.focus({preventScroll:true})}
  scroller.scrollTop=scrollTop;
}

function failureHtml(f,t){return '<div class="tempty tree-failure">'+esc(humanErrorSummary(f.message||f.error,f.needsAuth))+' <button class="diagnostics-link" data-debug-log="1">Open diagnostics</button>'+(f.needsAuth?'<button data-signin-tenant="'+esc(t)+'">Sign in</button>':'')+'</div>'}
function wireDiagnostics(root){Array.prototype.forEach.call(root.querySelectorAll('[data-debug-log]'),function(b){b.onclick=function(){var panel=$('debugPanel');panel.open=true;renderLog();panel.querySelector('summary').focus()}})}
$('visibilityBtn').onclick=function(){
  var tenants=state.s_tenants||[],subs=state.s_subscriptions||[];
  $('visibilityList').innerHTML=tenants.map(function(t){return '<div class="visibility-group" data-directory="'+esc(t.tenantId)+'"><label class="visibility-row"><input type="checkbox" data-visible-tenant="'+esc(t.tenantId)+'"'+(!hiddenTenants[t.tenantId]?' checked':'')+'><span class="visibility-label" title="'+esc(t.displayName)+'">'+esc(t.displayName)+'</span><span class="visibility-domain" title="'+esc((t.defaultDomain||'')+' '+t.tenantId)+'">'+esc(t.defaultDomain||'')+'</span></label>'+subs.filter(function(s){return s.tenantId===t.tenantId}).map(function(s){return '<label class="visibility-row sub"><input type="checkbox" data-visible-sub="'+esc(s.subscriptionId)+'"'+(!hiddenSubscriptions[s.subscriptionId]?' checked':'')+'><span class="visibility-label" title="'+esc(s.displayName||s.subscriptionId)+'">'+esc(s.displayName||s.subscriptionId)+'</span></label>'}).join('')+'</div>'}).join('');
  $('visibilitySearch').value='';
  Array.prototype.forEach.call($('visibilityList').querySelectorAll('[data-visible-tenant]'),function(c){
    var children=c.closest('.visibility-group').querySelectorAll('[data-visible-sub]');
    if(!c.checked)Array.prototype.forEach.call(children,function(child){child.checked=false});
    c.onchange=function(){if(!c.checked)Array.prototype.forEach.call(children,function(child){child.checked=false})};
  });
  Array.prototype.forEach.call($('visibilityList').querySelectorAll('[data-visible-sub]'),function(c){c.onchange=function(){if(c.checked)c.closest('.visibility-group').querySelector('[data-visible-tenant]').checked=true}});
  $('visibilityOverlay').classList.add('open');
};
$('visibilitySearch').oninput=function(){
  var q=this.value.trim().toLowerCase();
  Array.prototype.forEach.call($('visibilityList').querySelectorAll('.visibility-group'),function(g){
    var parent=g.querySelector('.visibility-row'),tenantMatch=(parent.textContent+' '+g.getAttribute('data-directory')).toLowerCase().indexOf(q)>=0,shown=false;
    Array.prototype.forEach.call(g.querySelectorAll('.visibility-row.sub'),function(row){var show=!q||tenantMatch||(row.textContent+' '+row.querySelector('input').getAttribute('data-visible-sub')).toLowerCase().indexOf(q)>=0;row.hidden=!show;if(show)shown=true});
    g.hidden=!!q&&!tenantMatch&&!shown;
  });
};
function bulkVisibility(checked){
  Array.prototype.forEach.call($('visibilityList').querySelectorAll('.visibility-group'),function(g){
    if(g.hidden)return;
    var hasHiddenChildren=Array.prototype.some.call(g.querySelectorAll('.visibility-row.sub'),function(row){return row.hidden});
    Array.prototype.forEach.call(g.querySelectorAll('.visibility-row'),function(row){
      if(row.hidden||(!row.classList.contains('sub')&&hasHiddenChildren))return;
      row.querySelector('input').checked=checked;
      if(checked&&row.classList.contains('sub'))g.querySelector('[data-visible-tenant]').checked=true;
    });
  });
}
$('visibilitySelectAll').onclick=function(){bulkVisibility(true)};
$('visibilityClearAll').onclick=function(){bulkVisibility(false)};
$('visibilityClose').onclick=function(){$('visibilityOverlay').classList.remove('open')};
$('visibilityApply').onclick=function(){
  Array.prototype.forEach.call($('visibilityList').querySelectorAll('[data-visible-sub]:checked'),function(c){c.closest('.visibility-group').querySelector('[data-visible-tenant]').checked=true});
  hiddenTenants=Object.assign({},hiddenTenants);hiddenSubscriptions=Object.assign({},hiddenSubscriptions);
  Array.prototype.forEach.call($('visibilityList').querySelectorAll('[data-visible-tenant]'),function(c){var id=c.getAttribute('data-visible-tenant');if(!c.checked)hiddenTenants[id]=1;else delete hiddenTenants[id]});
  Array.prototype.forEach.call($('visibilityList').querySelectorAll('[data-visible-sub]'),function(c){var id=c.getAttribute('data-visible-sub');if(!c.checked)hiddenSubscriptions[id]=1;else delete hiddenSubscriptions[id]});
  bridge.send('/save-prefs',{pinned:pinnedAccts,hiddenTenants:hiddenTenants,hiddenSubscriptions:hiddenSubscriptions});
  $('visibilityOverlay').classList.remove('open');renderTree();
};


var DATA_KINDS=[
  {k:'blob',label:'Blob Containers'},
  {k:'file',label:'File Shares'},
  {k:'queue',label:'Queues'},
  {k:'table',label:'Tables'}
];
function dataTitleFor(k){return k==='blob'?'Blob container':k==='file'?'File share':k==='queue'?'Queue':k==='table'?'Table':'Resource contents'}

function openCategoryFor(kind){
  var acct=state.s_account;if(!acct)return;
  var accObj=(state.s_accounts||[]).filter(function(x){return x.name===acct})[0];
  if(accObj)openSubs[accObj.subscriptionId]=true;
  activeSvc=kind;svcListMode=true;
  $('dataCard').classList.remove('min');
  ensureList(kind);
  renderTree();renderData();
}

function uploadFiles(fl){
  if(!fl||!fl.length)return;
  var target={account:state.s_account,container:state.s_container,prefix:state.s_blobPrefix||''};
  var items=[];var pending=fl.length;
  Array.prototype.forEach.call(fl,function(file){
    var rd=new FileReader();
    rd.onload=function(){var b64=String(rd.result).split(',')[1]||'';items.push({name:file.name,contentBase64:b64,contentType:file.type});if(--pending===0)bridge.send('/upload-many',Object.assign({items:items},target))};
    rd.onerror=function(){state.s_error='Could not read an upload file: '+file.name;renderError();if(--pending===0&&items.length)bridge.send('/upload-many',Object.assign({items:items},target))};
    rd.readAsDataURL(file);
  });
}
function wireDrop(el){
  var depth=0;
  el.ondragenter=function(e){e.preventDefault();depth++;el.classList.add('dragging')};
  el.ondragover=function(e){e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='copy'};
  el.ondragleave=function(){depth--;if(depth<=0){depth=0;el.classList.remove('dragging')}};
  el.ondrop=function(e){e.preventDefault();depth=0;el.classList.remove('dragging');var dt=e.dataTransfer;if(dt&&dt.files&&dt.files.length)uploadFiles(dt.files)};
}

function renderBlobData(el,cnt){
  var b=state.s_blobs||[];cnt.textContent='';
  var names={};b.forEach(function(x){names[x.name]=1});selected.forEach(function(n){if(!names[n])selected.delete(n)});
  var h=resourcePath('blob',state.s_container)+'<div class="vtool browsetools"><button id="dlBtn" title="Download selected blobs"'+(!selected.size?' disabled':'')+'>'+uiIcon('download')+' Download</button><button id="deleteSelected" title="Delete selected blobs"'+(!selected.size?' disabled':'')+'>'+uiIcon('trash')+' Delete</button><button id="blobSas" title="Create a SAS link for one selected blob"'+(selected.size!==1?' disabled':'')+'>'+uiIcon('link')+' Create SAS link</button><button class="selection-action" id="selAll" title="Select all shown blobs">Select all</button><button class="selection-action" id="selNone" title="Clear selection of shown blobs">Clear</button><button id="upBtn">'+uiIcon('upload')+' Upload</button><input type="file" id="upFiles" multiple hidden></div>';
  var folders=state.s_blobPrefixes||[];
  if(state.s_blobsMore){h+='<div class="vhint">More items are available. Use Next below. Search, selection and statistics apply to this page.</div>'}
  var rows=folders.map(function(prefix){return '<div class="row" data-directory="'+esc(prefix)+'"><span class="fname"><span class="row-check-space"></span>'+uiIcon('folder')+'<button class="path-link" data-blob-folder="'+esc(prefix)+'" title="'+esc(prefix)+'">'+esc(prefix.slice((state.s_blobPrefix||'').length))+'</button></span><span class="item-size"></span><span class="item-date"></span></div>'}).join('');
  rows+=b.map(function(x){var sel=selected.has(x.name)?' sel':'';var d=x.lastModified?new Date(x.lastModified).toLocaleString():'';return '<div class="row'+sel+'" data-blob="'+esc(x.name)+'"><span class="fname"><input class="blob-check" type="checkbox" aria-label="Select '+esc(x.name)+'"'+(selected.has(x.name)?' checked':'')+'>'+uiIcon('file')+'<span>'+esc(x.name)+'</span></span><span class="item-size">'+fmtBytes(x.size)+'</span><span class="item-date" title="'+esc(d)+'">'+esc(d)+'</span></div>'}).join('');
  h+=resourceList(rows||'<div class="empty">'+(state.s_loading?'Loading items\u2026':state.s_error?'Could not load items. Review the error above.':'No items in this directory.')+'</div>',b.length+folders.length,true);
  h+='<div class="dropmask"><div class="dropmsg"><span class="dropic">'+uiIcon('upload')+'</span><div>Drop files to upload to <b>'+esc(state.s_container||'this container')+'</b></div></div></div>';
  el.innerHTML=h;
  wireDrop(el);
  $('dlBtn').onclick=function(){if(selected.size)bridge.send('/download-many',{blobs:Array.from(selected)})};
  $('selAll').onclick=function(){Array.prototype.forEach.call(el.querySelectorAll('[data-blob]:not([hidden])'),function(row){selected.add(row.getAttribute('data-blob'))});renderData()};
  $('selNone').onclick=function(){Array.prototype.forEach.call(el.querySelectorAll('[data-blob]:not([hidden])'),function(row){selected.delete(row.getAttribute('data-blob'))});renderData()};
  $('upBtn').onclick=function(){$('upFiles').click()};
  $('upFiles').onchange=function(){uploadFiles(this.files)};
  Array.prototype.forEach.call(el.querySelectorAll('[data-blob]'),function(r){
    function toggle(){var n=r.getAttribute('data-blob');if(selected.has(n))selected.delete(n);else selected.add(n);renderData();var row=Array.prototype.find.call(el.querySelectorAll('[data-blob]'),function(x){return x.getAttribute('data-blob')===n});if(row)row.querySelector('input').focus()}
    r.onclick=function(e){if(e.target.closest('button'))return;toggle()};
    r.querySelector('input').onclick=function(e){e.stopPropagation();toggle()};
  });
  $('blobSas').onclick=function(){if(selected.size===1)openSasGen(Array.from(selected)[0])};
  $('deleteSelected').onclick=function(){deleteSelectedItems('blob',selected)};
  Array.prototype.forEach.call(el.querySelectorAll('[data-blob-folder],[data-blob-path]'),function(button){button.onclick=function(){bridge.send('/container',{account:state.s_account,container:state.s_container,prefix:button.getAttribute('data-blob-folder')||button.getAttribute('data-blob-path')||''})}});
  wireSeCta(el);
}
function deleteSelectedItems(kind,selection){
  var payload={account:state.s_account,kind:kind,resource:state.s_item,dir:kind==='file'?state.s_fileDir||'':'',prefix:kind==='blob'?state.s_blobPrefix||'':'',names:Array.from(selection)};
  askConfirm({title:'Delete selected items',msg:'Permanently delete '+payload.names.length+' selected item(s) from "'+payload.resource+(payload.dir?'/'+payload.dir:'')+'"? Directories must be empty. This cannot be undone.',okLabel:'Delete',danger:true}).then(function(ok){if(ok)bridge.send('/delete-selected',payload)});
}

var SEGS=[{k:'blob',label:'Blobs'},{k:'file',label:'File shares'},{k:'queue',label:'Queues'},{k:'table',label:'Tables'}];
function svcPlural(k){return k==='blob'?'blob containers':k==='file'?'file shares':k==='queue'?'queues':'tables'}
function svcListOf(k){var t=(state.s_tree||{})[state.s_account]||{};return k==='blob'?t.containers:k==='file'?t.shares:k==='queue'?t.queues:t.tables}
function svcCount(k){var a=svcListOf(k);return a?a.length:null}
function ensureList(k,paged){var a=state.s_account;if(!a)return;if(svcListOf(k)!=null){if(paged&&state.s_pages&&!state.s_pages[storagePageKey({account:a,kind:k})])bridge.send('/storage-page',{account:a,kind:k,direction:'refresh'});return}if(k==='blob')bridge.send('/tree-containers',{account:a});else if(k==='file')bridge.send('/list-shares',{account:a});else if(k==='queue')bridge.send('/list-queues',{account:a});else bridge.send('/list-tables',{account:a})}
function renderSwitcher(){return '<div class="svcbar" role="tablist" aria-label="Storage services">'+SEGS.map(function(s){var n=svcCount(s.k);var badge=n!=null?'<span class="segn">'+n+'</span>':'';return '<button role="tab" aria-label="'+s.label+'" aria-selected="'+(s.k===activeSvc)+'" tabindex="'+(s.k===activeSvc?'0':'-1')+'" class="seg'+(s.k===activeSvc?' act':'')+'" data-seg="'+s.k+'">'+svgIcon(s.k)+'<span class="segl">'+s.label+'</span>'+badge+'</button>'}).join('')+'</div>'}
var serviceClients=new Map(),restoreServiceClient=null;
function wireSwitcher(root){Array.prototype.forEach.call(root.querySelectorAll('[data-seg]'),function(b,index){b.onclick=async function(){
  var kd=b.getAttribute('data-seg');if(kd===activeSvc)return;
  saveServiceClient();
  activeSvc=kd;var saved=serviceClients.get(state.s_account+'|'+kd);svcListMode=saved?saved.listMode:true;
  if(!saved)renderData();
  restoreServiceClient=saved?Object.assign({account:state.s_account,kind:kd},saved):null;
  var response=await bridge.send('/activate-service',{account:state.s_account,kind:kd});if(!response.ok)return;
  ensureList(kd,true);renderData();
};b.onkeydown=function(e){var target=e.key==='Home'?0:e.key==='End'?SEGS.length-1:e.key==='ArrowRight'?(index+1)%SEGS.length:e.key==='ArrowLeft'?(index+SEGS.length-1)%SEGS.length:null;if(target===null)return;e.preventDefault();var key=SEGS[target].k;root.querySelector('[data-seg="'+key+'"]').click();root.querySelector('[data-seg="'+key+'"]').focus()}})}
function saveServiceClient(account){
  if(!state.s_account||!activeSvc)return;
  var view=$('dataBody').querySelector('.resource-list,.entity-viewport');
  serviceClients.set((account||state.s_account)+'|'+activeSvc,{listMode:svcListMode,selected:Array.from(selected),files:Array.from(selectedFiles),records:Array.from(selectedRecords),top:view?view.scrollTop:0,left:view?view.scrollLeft:0});
}
function itemMetaHtml(k,it){if(k==='queue'&&it.approximateMessagesCount!=null)return '<span class="imeta">'+it.approximateMessagesCount+' msgs</span>';if(k==='file'&&it.quotaGiB!=null)return '<span class="imeta">'+it.quotaGiB+' GiB</span>';return ''}
function openSvcItem(k,name){activeSvc=k;svcListMode=false;var a=state.s_account;if(k==='blob')bridge.send('/container',{container:name,account:a});else if(k==='queue')bridge.send('/open-queue',{queue:name,account:a});else if(k==='table')bridge.send('/open-table',{table:name,account:a});else bridge.send('/open-share',{share:name,account:a})}
function applyResourceCards(){
  var isBlobItem=state.s_item&&state.s_kind==='blob'&&activeSvc==='blob'&&!svcListMode;
  ['stats','share'].forEach(function(kind){var card=document.querySelector('[data-card="'+kind+'"]');if(card)card.hidden=!isBlobItem});
}
function renderServiceList(el){
  var k=activeSvc,a=state.s_account,arr=svcListOf(k),plural=svcPlural(k);
  if(arr&&state.s_pages&&!state.s_pages[storagePageKey({account:a,kind:k})])arr=arr.slice(0,100);
  var queryKey=a+'|'+k,query=resourceQueries[queryKey]||'';
  var newLabel=k==='blob'?'New container':k==='file'?'New share':k==='queue'?'New queue':'New table';
  var h='<div class="resource-context"><div class="resource-path"><button class="backlink" aria-label="Back" title="Back" disabled>'+uiIcon('back')+'</button><span>'+esc(plural.charAt(0).toUpperCase()+plural.slice(1))+'</span></div>'+searchControl('resourceSearch','Search '+plural,query)+'</div><div class="resource-toolbar">'+(arr!=null?'<button id="svcNew">'+uiIcon('add')+' '+newLabel+'</button><button id="svcDelete"'+(selectedRecords.size!==1?' disabled':'')+'>'+uiIcon('trash')+' Delete</button>':'')+'</div>';
  if(arr==null){h+=state.s_error?'<div class="empty">Could not load '+plural+'. Review the error above.</div><button id="svcRetry">Retry</button>':'<div class="empty">'+uiIcon('busy',{size:13,className:'spin'})+' loading '+plural+'\u2026</div>';el.innerHTML=h;var nb0=$('svcNew');if(nb0)nb0.onclick=function(){createInCategory(k,a)};var retry=$('svcRetry');if(retry)retry.onclick=function(){state.s_error=null;ensureList(k);renderData()};return}
  if(!arr.length){h+=resourceList('<div class="empty">No '+plural+' in this account yet.</div>',0)}
  else{h+=resourceList(arr.map(function(it){return '<div class="row svc-item" data-open="'+esc(it.name)+'"><span class="fname"><input type="checkbox" data-resource-select="'+esc(it.name)+'" aria-label="Select '+esc(it.name)+'"'+(selectedRecords.has(it.name)?' checked':'')+'>'+svgIcon(k)+' <span>'+esc(it.name)+'</span></span><span class="meta">'+itemMetaHtml(k,it)+'</span></div>'}).join(''),arr.length)+'<div id="resourceNoMatch" class="empty" hidden>No matching '+plural+'.</div>'}
  el.innerHTML=h;
  function filterResources(){var q=$('resourceSearch').value.toLowerCase(),visible=0;resourceQueries[queryKey]=$('resourceSearch').value;Array.prototype.forEach.call(el.querySelectorAll('[data-open]'),function(row){row.hidden=row.getAttribute('data-open').toLowerCase().indexOf(q)<0;if(!row.hidden)visible++});var empty=$('resourceNoMatch');if(empty)empty.hidden=visible>0}
  $('resourceSearch').oninput=filterResources;filterResources();
  $('svcNew').onclick=function(){createInCategory(k,a)};
  Array.prototype.forEach.call(el.querySelectorAll('[data-open]'),function(r){r.tabIndex=0;r.setAttribute('aria-label','Open '+r.getAttribute('data-open'));r.onclick=function(event){if(event.target.closest('button,input,a,select,textarea,label'))return;openSvcItem(k,r.getAttribute('data-open'))};r.onkeydown=function(event){if(event.target===r&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openSvcItem(k,r.getAttribute('data-open'))}}});
  if($('svcDelete'))$('svcDelete').onclick=function(){if(selectedRecords.size===1)deleteItem(k,Array.from(selectedRecords)[0],a)};
  Array.prototype.forEach.call(el.querySelectorAll('[data-resource-select]'),function(input){input.onchange=function(){var name=input.dataset.resourceSelect;if(input.checked)selectedRecords.add(name);else selectedRecords.delete(name);$('svcDelete').disabled=selectedRecords.size!==1}});
}
function storageTarget(){
  return {account:state.s_account,kind:activeSvc,resource:svcListMode?undefined:state.s_item,prefix:!svcListMode&&activeSvc==='blob'?state.s_blobPrefix||'':'',dir:!svcListMode&&activeSvc==='file'?state.s_fileDir||'':''};
}
function storagePageKey(t){return JSON.stringify([t.account||'',t.kind,t.resource||'',t.dir||t.prefix||''])}
function wireStoragePager(el,target){
  if(!target.account)return;
  var key=storagePageKey(target),page=(state.s_pages||{})[key];
  var queuePeek=target.kind==='queue'&&target.resource;if(queuePeek)page={index:0,cachedPageCount:1};
  var loading=state.s_pageLoading===key;
  var count=target.kind==='sas'?(state.s_sasBlobs||[]).length:target.kind==='table'&&target.resource?(state.s_entities&&state.s_entities.rows||[]).length:el.querySelectorAll('.resource-list .row,tbody tr').length;
  function arrow(name,disabled){return '<button data-page-dir="'+name+'" aria-label="'+name[0].toUpperCase()+name.slice(1)+' page" title="'+(name==='last'?'Last cached page; Next loads more from Azure':name[0].toUpperCase()+name.slice(1)+' page')+'"'+(disabled?' disabled':'')+'>'+uiIcon(name==='previous'?'back':name==='next'?'forward':name)+'</button>'}
  el.insertAdjacentHTML('beforeend','<nav class="storage-pager" aria-label="Listing pages"><span class="page-count">'+count+' loaded item'+(count===1?'':'s')+(page&&page.cachedItemCount>count?' ('+page.cachedItemCount+' cached)':'')+'</span>'+(page?'<span class="page-buttons">'+arrow('first',!page.index||loading)+arrow('previous',!page.index||loading)+'<span>Page '+(page.index+1)+'</span>'+arrow('next',!page.nextToken&&!(page.index+1<page.cachedPageCount)||loading)+arrow('last',!(page.index+1<page.cachedPageCount)||loading)+'<button data-page-dir="refresh">'+uiIcon('refresh')+'</button></span>':'')+'</nav>');
  el.querySelector('.storage-pager').dataset.pageKey=key;
  if(queuePeek)el.querySelector('.storage-pager').dataset.queuePeek='true';
  Array.prototype.forEach.call(el.querySelectorAll('[data-page-dir]'),function(button){button.onclick=function(){if(queuePeek){if(button.dataset.pageDir==='refresh'&&!state.s_loading)bridge.send('/open-queue',{account:target.account,queue:target.resource});return}var busy=state.s_pageLoading===key;bridge.send('/storage-page',Object.assign({},target,{direction:busy&&button.dataset.pageDir==='refresh'?'cancel':button.dataset.pageDir}))}});
  updateStoragePagers();
}
function updateStoragePagers(){
  Array.prototype.forEach.call(document.querySelectorAll('.storage-pager'),function(nav){
    var key=nav.dataset.pageKey,peek=nav.dataset.queuePeek==='true',page=peek?{index:0,cachedPageCount:1}:(state.s_pages||{})[key];if(!page)return;
    var loading=peek?!!state.s_loading:state.s_pageLoading===key;
    nav.querySelector('[data-page-dir="previous"]').disabled=loading||!page.index;
    nav.querySelector('[data-page-dir="next"]').disabled=loading||!page.nextToken&&!(page.index+1<page.cachedPageCount);
    var refresh=nav.querySelector('[data-page-dir="refresh"]');
    refresh.disabled=peek&&loading;refresh.setAttribute('aria-busy',String(loading));
    refresh.setAttribute('aria-label',loading?(peek?'Refreshing messages':'Cancel page loading'):'Refresh page');
    refresh.title=peek?(loading?'Refreshing messages':'Refresh messages (peek up to 32; no continuation paging)'):loading?'Loading page; click to cancel after the current Azure read completes':'Refresh from first page';
    var icon=loading?'busy':'refresh';if(refresh.dataset.icon!==icon){refresh.innerHTML=uiIcon(icon);refresh.dataset.icon=icon}
    nav.querySelector('[data-page-dir="first"]').disabled=loading||!page.index;
    nav.querySelector('[data-page-dir="last"]').disabled=loading||!(page.index+1<page.cachedPageCount);
  });
}
var lastDataSignature='';
function dataSignature(){return JSON.stringify([state.s_account,state.s_kind,state.s_item,state.s_blobPrefix,state.s_fileDir,state.s_loading,state.s_error,(state.s_tree||{})[state.s_account],state.s_blobs,state.s_blobPrefixes,state.s_blobsMore,state.s_files,state.s_entitiesRevision,state.s_messages,state.s_pages,activeSvc,svcListMode])}
function renderData(onlyChanged){
  if(onlyChanged&&dataSignature()===lastDataSignature)return;
  if(lastAcct&&state.s_account!==lastAcct)saveServiceClient(lastAcct);
  var oldViewport=$('dataBody').querySelector('.entity-viewport');
  var oldEntityLeft=oldViewport?oldViewport.scrollLeft:0,oldEntityTop=oldViewport?oldViewport.scrollTop:0,oldResource=lastResourceKey;
  if(oldViewport&&oldViewport.__dispose)oldViewport.__dispose();
  var focusedTab=document.activeElement?.getAttribute('data-seg');
  var previousList=$('dataBody').querySelector('.resource-list'),previousScroll=previousList?previousList.scrollTop:0,previousScope=lastItemKey;
  renderDataInner();applyResourceCards();var transfer=document.querySelector('[data-card="transfer"]');if(transfer)transfer.hidden=!!activeSvc&&activeSvc!=='blob';
  if(focusedTab){var nextTab=$('svcBar').querySelector('[data-seg="'+focusedTab+'"]');if(nextTab)nextTab.focus({preventScroll:true})}
  var currentList=$('dataBody').querySelector('.resource-list');if(currentList&&previousScope===lastItemKey)currentList.scrollTop=previousScroll;
  var el=$('dataBody');
  Array.prototype.forEach.call(el.querySelectorAll('[data-blob]'),function(row){row.querySelector('.fname').title=row.getAttribute('data-blob')});
  Array.prototype.forEach.call(el.querySelectorAll('.rowact'),function(button){
    var label=button.textContent.trim(),kind=button.classList.contains('del')?'trash':button.hasAttribute('data-shdl')?'download':'edit';
    var row=button.closest('.row,tr'),name=row?row.querySelector('.fname'):null;
    if(kind==='download')label='Download';if(name)label+=' '+name.textContent.trim();
    button.className='resource-delete';button.title=label;button.setAttribute('aria-label',label);button.innerHTML=uiIcon(kind);
  });
  if(!svcListMode&&state.s_item){
    var rows=el.querySelectorAll('.list .row,tbody tr'),key=state.s_account+'|'+activeSvc+'|'+state.s_item+'|'+(activeSvc==='file'?state.s_fileDir||'':state.s_blobPrefix||''),query=resourceQueries[key]||'';
    var toolbar=el.querySelector('.vtool');
    if(toolbar&&!el.querySelector('.entity-viewport')){
      var path=el.querySelector('.resource-path');
      if(!path){el.insertAdjacentHTML('afterbegin',resourcePath(activeSvc,state.s_item));path=el.querySelector('.resource-path')}
      var context=document.createElement('div');context.className='resource-context';path.parentNode.insertBefore(context,path);context.appendChild(path);context.insertAdjacentHTML('beforeend',searchControl('contentSearch','Search items',query));
      el.insertAdjacentHTML('beforeend','<div class="empty" id="contentNoMatch" hidden>No matching items.</div>');
      function filter(){var value=$('contentSearch').value,shown=0;resourceQueries[key]=value;Array.prototype.forEach.call(rows,function(row){row.hidden=row.textContent.toLowerCase().indexOf(value.toLowerCase())<0;if(!row.hidden)shown++});$('contentNoMatch').hidden=!value||shown>0}
      $('contentSearch').oninput=filter;filter();
    }
    if(state.s_loading)Array.prototype.forEach.call(el.querySelectorAll('.vtool button'),function(button){button.disabled=true});
    fitResourcePath();
  }
  wireStoragePager(el,storageTarget());
  Array.prototype.forEach.call(el.querySelectorAll('[data-directory],[data-file-item]'),function(row){
    var link=row.querySelector('[data-blob-folder],[data-file-folder]');if(!link)return;
    row.style.cursor='pointer';
    row.onclick=function(event){if(event.target.closest('button,input,a,select,textarea,label'))return;link.click()};
  });
  if(el.querySelector('.entity-viewport')){
    var context=document.createElement('div');context.className='resource-context';
    context.innerHTML=resourcePath('table',state.s_item)+searchControl('entitySearch','Search items',resourceQueries[state.s_account+'|table|'+state.s_item]||'');
    el.insertBefore(context,el.firstChild);
    var queryKey=state.s_account+'|table|'+state.s_item;
    mountEntityViewport(el.querySelector('.entity-viewport'),state.s_entities,resourceQueries[queryKey]||'');
    if(oldViewport&&oldResource===lastResourceKey){var viewport=el.querySelector('.entity-viewport');viewport.scrollLeft=oldEntityLeft;if(previousScope===lastItemKey)viewport.scrollTop=oldEntityTop}
    $('entitySearch').oninput=function(){resourceQueries[queryKey]=this.value;mountEntityViewport(el.querySelector('.entity-viewport'),state.s_entities,this.value)};
  }
  if(restoreServiceClient&&restoreServiceClient.account===state.s_account&&restoreServiceClient.kind===state.s_kind){
    var saved=restoreServiceClient;restoreServiceClient=null;
    var view=el.querySelector('.resource-list,.entity-viewport');if(view){view.scrollTop=saved.top;view.scrollLeft=saved.left}
    Array.prototype.forEach.call(el.querySelectorAll('[data-blob] input[type="checkbox"]'),function(input){input.checked=selected.has(input.closest('[data-blob]').getAttribute('data-blob'))});
    Array.prototype.forEach.call(el.querySelectorAll('[data-file-select]'),function(input){input.checked=selectedFiles.has(input.getAttribute('data-file-select'))});
  }
  var back=$('svcBack');if(back)back.onclick=function(){
    if(activeSvc==='blob'&&state.s_blobPrefix){var parts=state.s_blobPrefix.split('/');parts.splice(-2);bridge.send('/container',{account:state.s_account,container:state.s_item,prefix:parts.length?parts.join('/')+'/':''});return}
    if(activeSvc==='file'&&state.s_fileDir){bridge.send('/open-share',{account:state.s_account,share:state.s_item,dir:state.s_fileDir.split('/').slice(0,-1).join('/')});return}
    svcListMode=true;selectedRecords.clear();ensureList(activeSvc);renderData();
  };
  wireCommandIcons(el);
  fitResourcePath();
  lastDataSignature=dataSignature();
}
function wireCommandIcons(el){
  var icons={svcNew:'add',selAll:'select',shAll:'select',selNone:'clear',shNone:'clear',shMkdir:'folder',qSend:'send',qClear:'clear',qDel:'trash',tAdd:'add',tDel:'trash'};
  Array.prototype.forEach.call(el.querySelectorAll('.vtool button,.resource-toolbar button'),function(button){
    var icon=icons[button.id];if(!icon||button.querySelector('svg'))return;
    button.innerHTML=uiIcon(icon)+' <span>'+esc(button.textContent.trim().replace(/^[+\uFF0B]\\s*/,''))+'</span>';
  });
}
function mountEntityViewport(view,e,query){
  var renderStarted=performance.now();
  if(view.__dispose)view.__dispose();
  var cols=e.columns,rows=e.rows.map(function(row,i){return {row:row,index:i}}).filter(function(x){return !query||Object.values(x.row).join(' ').toLowerCase().includes(query.toLowerCase())});
  var width=160,totalCols=cols.length+1,rowHeight=40,headerHeight=36,frame=0,lastRange='';
  function columnLeft(index){return index?40+(index-1)*width:0}
  view.innerHTML='<div class="entity-spacer" style="width:'+columnLeft(totalCols)+'px;height:'+(headerHeight+rows.length*rowHeight)+'px"><div class="entity-window"></div></div>'+(!rows.length?'<div class="empty">No matching items.</div>':'');
  view.setAttribute('role','table');view.setAttribute('aria-label','Table entities');view.setAttribute('aria-colcount',totalCols);view.setAttribute('aria-rowcount',rows.length+1);view.tabIndex=0;
  var layer=view.querySelector('.entity-window');
  var head=document.createElement('div'),headCells=new Map(),visibleRows=new Map();
  head.className='entity-vhead';head.setAttribute('role','row');head.setAttribute('aria-rowindex','1');layer.append(head);
  function paintCells(parent,cells,firstCol,lastCol,item){
    var recycled=[];
    cells.forEach(function(cell,column){if(column<firstCol||column>=lastCol){recycled.push(cell);cells.delete(column)}});
    for(var c=firstCol;c<lastCol;c++){
      var cell=cells.get(c);
      if(!cell){
        cell=recycled.shift()||document.createElement('div');cell.className='entity-vcell';cell.setAttribute('role',item?'cell':'columnheader');cell.setAttribute('aria-colindex',c+1);
        cell.style.width=c===0?'40px':'';
        if(item){
          var value=c?item.row[cols[c-1]]:null,text=value==null?'':String(value);
          cell.setAttribute('aria-label',c?cols[c-1]:'Selection');cell.title=text;
          if(c===0){
            cell.textContent='';
            var input=document.createElement('input');input.type='checkbox';input.dataset.entitySelect=item.index;
            input.setAttribute('aria-label','Select entity '+item.row.partitionKey+', '+item.row.rowKey);
            input.checked=selectedRecords.has(entityKey(item.row));cell.append(input);
          }else if(cell.textContent!==text.slice(0,300)||cell.firstElementChild)cell.textContent=text.slice(0,300);
        }else{
          if(c===0)cell.setAttribute('aria-label','Selection');else cell.removeAttribute('aria-label');
          var label=c===0?'':cols[c-1];if(cell.textContent!==label)cell.textContent=label;
        }
        cells.set(c,cell);
      }
      if(item&&c===0)cell.firstChild.checked=selectedRecords.has(entityKey(item.row));
      var position=c-firstCol;
      if(parent.children[position]!==cell)parent.insertBefore(cell,parent.children[position]||null);
    }
    recycled.forEach(function(cell){cell.remove()});
  }
  function paint(){
    frame=0;
    var firstCol=Math.max(0,Math.floor((view.scrollLeft-40)/width)),lastCol=Math.min(totalCols,Math.ceil((view.scrollLeft+view.clientWidth-40)/width)+2);
    var firstRow=Math.max(0,Math.floor((view.scrollTop-headerHeight)/rowHeight)-2),lastRow=Math.min(rows.length,Math.ceil((view.scrollTop+view.clientHeight-headerHeight)/rowHeight)+2);
    var range=[firstCol,lastCol,firstRow,lastRow].join('|');
    head.style.top=view.scrollTop+'px';
    if(range===lastRange)return;
    lastRange=range;
    head.style.left=columnLeft(firstCol)+'px';
    paintCells(head,headCells,firstCol,lastCol);
    visibleRows.forEach(function(entry,index){if(index<firstRow||index>=lastRow){entry.node.remove();visibleRows.delete(index)}});
    for(var r=firstRow;r<lastRow;r++){
      var item=rows[r],entry=visibleRows.get(r);
      if(!entry){
        var node=document.createElement('div');node.className='entity-vrow';node.setAttribute('role','row');
        node.setAttribute('aria-rowindex',r+2);node.dataset.entityIndex=item.index;node.style.top=(headerHeight+r*rowHeight)+'px';
        entry={node:node,cells:new Map()};visibleRows.set(r,entry);
      }
      entry.node.style.left=columnLeft(firstCol)+'px';entry.node.setAttribute('aria-selected',String(selectedRecords.has(entityKey(item.row))));
      paintCells(entry.node,entry.cells,firstCol,lastCol,item);
      var position=r-firstRow+1;
      if(layer.children[position]!==entry.node)layer.insertBefore(entry.node,layer.children[position]||null);
    }
  }
  view.onscroll=function(){if(!frame)frame=requestAnimationFrame(paint)};
  view.onkeydown=function(event){
    if(event.target!==view)return;
    var left=view.scrollLeft,top=view.scrollTop;
    if(event.key==='ArrowRight')left+=width;else if(event.key==='ArrowLeft')left-=width;
    else if(event.key==='ArrowDown')top+=rowHeight;else if(event.key==='ArrowUp')top-=rowHeight;
    else if(event.key==='PageDown')top+=view.clientHeight-headerHeight;else if(event.key==='PageUp')top-=view.clientHeight-headerHeight;
    else if(event.key==='End')left=totalCols*width;else if(event.key==='Home')left=0;else return;
    event.preventDefault();view.scrollLeft=left;view.scrollTop=top;
  };
  view.onclick=function(event){
    var input=event.target.closest('[data-entity-select]');if(!input)return;
    var key=entityKey(e.rows[Number(input.dataset.entitySelect)]);
    if(input.checked)selectedRecords.add(key);else selectedRecords.delete(key);
    input.closest('[role="row"]').setAttribute('aria-selected',String(input.checked));
    $('tEdit').disabled=$('tDelete').disabled=selectedRecords.size!==1;
  };
  var resize=new ResizeObserver(function(){lastRange='';if(!frame)frame=requestAnimationFrame(paint)});resize.observe(view);
  view.__dispose=function(){resize.disconnect();if(frame)cancelAnimationFrame(frame)};
  paint();
  performance.clearMeasures('storage-entity-render');
  performance.measure('storage-entity-render',{start:renderStarted,end:performance.now()});
}
function renderDataInner(){
  var card=$('dataCard'),el=$('dataBody'),tEl=$('dataTitleTxt'),icEl=$('dataTitleIc'),cnt=$('dataCount'),bar=$('svcBar');
  card.style.display='';
  var acct=state.s_account;cnt.textContent='';
  card.querySelector('.resource-head').hidden=!acct;
  if(!acct){icEl.innerHTML='';tEl.textContent='';if(bar){bar.innerHTML='';bar.style.display='none'}activeSvc=null;lastAcct='';el.innerHTML='<p class="muted">Select a storage account.</p>';return}
  if(acct!==lastAcct){lastAcct=acct;activeSvc='blob';svcListMode=true;lastItemKey='';ensureList('file');ensureList('queue');ensureList('table')}
  var page=(state.s_pages||{})[storagePageKey({account:acct,kind:state.s_kind,resource:state.s_item,prefix:state.s_kind==='blob'?state.s_blobPrefix||'':'',dir:state.s_kind==='file'?state.s_fileDir||'':''})];
  var resourceKey=acct+'|'+(state.s_kind||'')+'|'+(state.s_item||'')+'|'+(state.s_kind==='file'?state.s_fileDir||'':state.s_blobPrefix||''),itemKey=resourceKey+'|'+(page?page.index:0);
  if(itemKey!==lastItemKey){lastItemKey=itemKey;selected.clear();selectedFiles.clear();selectedRecords.clear()}
  if(restoreServiceClient){selected=new Set(restoreServiceClient.selected);selectedFiles=new Set(restoreServiceClient.files);selectedRecords=new Set(restoreServiceClient.records||[])}
  if(resourceKey!==lastResourceKey){lastResourceKey=resourceKey;if(state.s_item){activeSvc=state.s_kind;svcListMode=restoreServiceClient?restoreServiceClient.listMode:false}}
  if(!activeSvc)activeSvc='blob';
  var k=state.s_kind,item=state.s_item;
  var showItem=item&&k===activeSvc&&!svcListMode;
  var recordsTarget=storageTarget(),recordsPage=(state.s_pages||{})[storagePageKey(recordsTarget)];
  var recordsScope=storagePageKey(recordsTarget)+'|'+(recordsPage?recordsPage.index:0);
  if(lastRecordsScope!==recordsScope&&!restoreServiceClient)selectedRecords.clear();lastRecordsScope=recordsScope;
  el.classList.toggle('table-view',!!showItem&&k==='table');
  if(showItem){icEl.innerHTML=svgIcon(k);tEl.textContent=acct;}
  else{icEl.innerHTML=svgIcon('account');tEl.textContent=acct;}
  if(bar){bar.style.display='';bar.innerHTML=renderSwitcher();wireSwitcher(bar)}
  if(!showItem){renderServiceList(el);return}
  if(k==='blob'){renderBlobData(el,cnt);return}
  if(k==='queue'){
    var m=state.s_messages||[];
    selectedRecords.forEach(function(key){if(!m.some(function(message){return message.messageId===key}))selectedRecords.delete(key)});
    var draftKey=JSON.stringify([acct,item]);
    var h='<div class="vtool"><input id="qMsg" placeholder="Message text" value="'+esc(queueDrafts[draftKey]||'')+'" style="flex:1"><button class="primary" id="qSend">Send</button><button id="qEdit"'+(selectedRecords.size!==1?' disabled':'')+'>'+uiIcon('edit')+' Edit</button><button id="qDelete"'+(selectedRecords.size!==1?' disabled':'')+'>'+uiIcon('trash')+' Delete</button><button id="qClear">Clear messages</button><button class="danger" id="qDel">Delete queue</button></div>';
    if(!m.length){h+='<div class="resource-list"><div class="empty">'+(state.s_loading?'Loading messages\u2026':state.s_error?'Could not load messages. Review the error above.':'No messages returned by peek.')+'</div></div>'}
    else{h+='<div class="resource-list queue-contents"><table><thead><tr><th aria-label="Selection"></th><th>Message ID</th><th>Dequeue count</th><th>Inserted</th><th>Text</th></tr></thead><tbody>'+m.map(function(x){var d=x.insertedOn?new Date(x.insertedOn).toLocaleString():'';var txt=x.messageText||'';return '<tr><td><input type="checkbox" data-message-select="'+esc(x.messageId)+'" aria-label="Select message '+esc(x.messageId)+'"'+(selectedRecords.has(x.messageId)?' checked':'')+'></td><td class="message-id">'+esc(x.messageId)+'</td><td>'+x.dequeueCount+'</td><td>'+esc(d)+'</td><td>'+esc(txt.slice(0,400))+'</td></tr>'}).join('')+'</tbody></table></div>'}
    el.innerHTML=h;
    $('qMsg').oninput=function(){queueDrafts[draftKey]=this.value};
    $('qSend').onclick=function(){var t=$('qMsg').value;if(!t)return;bridge.send('/queue-send',{queue:item,text:t}).then(function(result){if(result&&result.ok&&queueDrafts[draftKey]===t){delete queueDrafts[draftKey];if(state.s_account===acct&&state.s_item===item&&$('qMsg'))$('qMsg').value=''}})};
    $('qMsg').onkeydown=function(e){if(e.key==='Enter')$('qSend').click()};
    $('qClear').onclick=function(){askConfirm({title:'Clear messages',msg:'Delete ALL messages in queue "'+item+'"?',okLabel:'Clear',danger:true}).then(function(ok){if(ok)bridge.send('/queue-clear',{queue:item})})};
    $('qDel').onclick=function(){deleteItem('queue',item)};
    function pickedMessage(){return selectedRecords.size===1?m.find(function(x){return selectedRecords.has(x.messageId)}):null}
    $('qEdit').onclick=function(){var message=pickedMessage();if(!message)return;askConfirm({title:'Edit message',msg:'Update this message. Azure must briefly receive the batch to edit it; dequeue counts may rise.',input:true,rows:3,value:message.messageText||'',okLabel:'Save'}).then(function(t){if(t!==null)bridge.send('/queue-msg-update',{queue:item,messageId:message.messageId,text:t})})};
    $('qDelete').onclick=function(){var message=pickedMessage();if(!message)return;askConfirm({title:'Delete message',msg:'Delete this message from queue "'+item+'"? Azure must briefly receive the batch; dequeue counts may rise.',okLabel:'Delete',danger:true}).then(function(ok){if(ok)bridge.send('/queue-msg-delete',{queue:item,messageId:message.messageId})})};
    Array.prototype.forEach.call(el.querySelectorAll('[data-message-select]'),function(input){input.onchange=function(){if(input.checked)selectedRecords.add(input.dataset.messageSelect);else selectedRecords.delete(input.dataset.messageSelect);$('qEdit').disabled=$('qDelete').disabled=!pickedMessage()}});
  }
  else if(k==='table'){
    var e=state.s_entities;
    selectedRecords.forEach(function(key){if(!e||!e.rows.some(function(row){return entityKey(row)===key}))selectedRecords.delete(key)});
    var h='<div class="vtool"><button class="primary" id="tAdd">Add entity</button><button id="tEdit"'+(selectedRecords.size!==1?' disabled':'')+'>'+uiIcon('edit')+' Edit</button><button id="tDelete"'+(selectedRecords.size!==1?' disabled':'')+'>'+uiIcon('trash')+' Delete</button><button class="danger" id="tDel">Delete table</button></div>';
    if(!e||!e.rows.length){h+='<div class="resource-list"><div class="empty">'+(state.s_loading?'Loading entities\u2026':state.s_error?'Could not load entities. Review the error above.':'No entities yet. Use Add entity to create one.')+'</div></div>'}
    else{
      h+='<div class="entity-viewport"></div>';
    }
    el.innerHTML=h;
    $('tAdd').onclick=function(){openEntityForm(null)};
    $('tDel').onclick=function(){deleteItem('table',item)};
    function pickedEntity(){return selectedRecords.size===1&&e?e.rows.find(function(row){return selectedRecords.has(entityKey(row))}):null}
    $('tEdit').onclick=function(){var row=pickedEntity();if(row)openEntityForm(row)};
    $('tDelete').onclick=function(){var row=pickedEntity();if(!row)return;askConfirm({title:'Delete entity',msg:'Delete entity ('+row.partitionKey+', '+row.rowKey+')?',okLabel:'Delete',danger:true}).then(function(ok){if(ok)bridge.send('/entity-delete',{table:item,partitionKey:row.partitionKey,rowKey:row.rowKey})})};
  }
  else if(k==='file'){
    var f=state.s_files||[];
    selectedFiles.forEach(function(name){if(!f.some(function(x){return x.name===name}))selectedFiles.delete(name)});
    var dir=state.s_fileDir||'';
    var h=resourcePath('file',item)+'<div class="vtool"><input type="file" id="shFile" hidden><button id="shDownload" title="Download selected files"'+(!f.some(function(x){return x.kind==='file'&&selectedFiles.has(x.name)})?' disabled':'')+'>'+uiIcon('download')+' Download</button><button id="shDelete" title="Delete selected files and empty directories"'+(!selectedFiles.size?' disabled':'')+'>'+uiIcon('trash')+' Delete</button><button class="selection-action" id="shAll" title="Select all shown items">Select all</button><button class="selection-action" id="shNone" title="Clear selection of shown items">Clear</button><button id="shUp">'+uiIcon('upload')+' Upload</button><button id="shMkdir">New folder</button></div>';
    if(!f.length){h+=resourceList('<div class="empty">'+(state.s_loading?'Loading items\u2026':state.s_error?'Could not load items. Review the error above.':'No items in this directory.')+'</div>',0,true)}
    else{h+=resourceList(f.slice().sort(function(a,b){return Number(b.kind==='directory')-Number(a.kind==='directory')}).map(function(x){var ic=uiIcon(x.kind==='directory'?'folder':'file');var size=x.kind==='file'?fmtBytes(x.size):'',date=x.kind==='file'&&x.lastModified?new Date(x.lastModified).toLocaleString():'';return '<div class="row" data-file-item="'+esc(x.name)+'"><span class="fname"><input type="checkbox" class="blob-check" data-file-select="'+esc(x.name)+'" aria-label="Select '+esc(x.name)+'"'+(selectedFiles.has(x.name)?' checked':'')+'>'+ic+(x.kind==='directory'?'<button class="path-link" data-file-folder="'+esc(x.name)+'">'+esc(x.name)+'</button>':'<span>'+esc(x.name)+'</span>')+'</span><span class="item-size">'+esc(size)+'</span><span class="item-date" title="'+esc(date)+'">'+esc(date)+'</span></div>'}).join(''),f.length,true)}
    el.innerHTML=h;
    $('shUp').onclick=function(){$('shFile').click()};
    $('shFile').onchange=function(){var fl=this.files;if(!fl||!fl.length)return;var file=fl[0];var rd=new FileReader();rd.onload=function(){var b64=String(rd.result).split(',')[1]||'';bridge.send('/share-upload',{account:acct,share:item,name:file.name,contentBase64:b64,dir:dir})};rd.onerror=function(){state.s_error='Could not read an upload file: '+file.name;renderError()};rd.readAsDataURL(file)};
    $('shMkdir').onclick=function(){askConfirm({title:'New folder',msg:'Directory name to create in "'+item+(dir?'/'+dir:'')+'":',input:true,okLabel:'Create'}).then(function(d){d=(d||'').trim();if(d)bridge.send('/share-mkdir',{account:acct,share:item,dir:dir,name:d})})};
    $('shDelete').onclick=function(){deleteSelectedItems('file',selectedFiles)};
    $('shDownload').onclick=async function(){var names=Array.from(selectedFiles);for(var x of f){if(x.kind==='file'&&names.indexOf(x.name)>=0){var r=await bridge.send('/share-download',{account:acct,share:item,name:x.name,dir:dir});if(!r.ok)break}}};
    function selectShown(on){Array.prototype.forEach.call(el.querySelectorAll('[data-file-item]:not([hidden])'),function(row){if(on)selectedFiles.add(row.getAttribute('data-file-item'));else selectedFiles.delete(row.getAttribute('data-file-item'))});renderData()}
    $('shAll').onclick=function(){selectShown(true)};$('shNone').onclick=function(){selectShown(false)};
    Array.prototype.forEach.call(el.querySelectorAll('[data-file-select]'),function(c){c.onchange=function(){var name=c.getAttribute('data-file-select');if(c.checked)selectedFiles.add(name);else selectedFiles.delete(name);renderData();var next=Array.prototype.find.call(el.querySelectorAll('[data-file-select]'),function(x){return x.getAttribute('data-file-select')===name});if(next)next.focus()}});
    Array.prototype.forEach.call(el.querySelectorAll('[data-file-folder]'),function(b){b.onclick=function(){bridge.send('/open-share',{share:item,account:acct,dir:[dir,b.getAttribute('data-file-folder')].filter(Boolean).join('/')})}});
    Array.prototype.forEach.call(el.querySelectorAll('[data-file-path]'),function(b){b.onclick=function(){bridge.send('/open-share',{share:item,account:acct,dir:b.getAttribute('data-file-path')})}});
  }
}
var xferTimer=null;
function dismissXfer(){if(xferTimer){clearTimeout(xferTimer);xferTimer=null}var el=$('xfer');if(el){el.style.display='none';el.innerHTML=''}bridge.send('/dismiss-batch',{})}
function shortPath(p){if(!p)return '';var sep=String.fromCharCode(92);var norm=p.split('/').join(sep);var parts=norm.split(sep);if(parts.length<=3)return norm;return parts[0]+sep+'\u2026'+sep+parts.slice(-2).join(sep)}
function renderBatch(){
  var el=$('xfer');if(!el)return;var s=state.s_batch;
  if(!s){if(xferTimer){clearTimeout(xferTimer);xferTimer=null}el.style.display='none';el.innerHTML='';return}
  var pct=s.total?Math.round(100*s.done/s.total):0;
  var opn={upload:{g:'Uploading',d:'Upload',n:'file'},download:{g:'Downloading',d:'Download',n:'file'},archive:{g:'Moving to Archive',d:'Archive',n:'blob'},'delete':{g:'Deleting',d:'Delete',n:'blob'}};
  var o=opn[s.op]||opn.download;
  var title=s.running?o.g+'\u2026':(s.failed.length?o.d+' finished with issues':o.d+' complete');
  var h='<div class="xf-head"><span class="xf-title">'+(s.running?''+uiIcon('busy',{size:13,className:'spin'})+' ':uiIcon('check'))+esc(title)+'</span><button class="xf-x" id="xferClose" title="Dismiss">'+uiIcon('clear')+'</button></div>';
  h+='<div class="xf-bar"><i style="width:'+pct+'%"></i></div>';
  h+='<div class="xf-meta"><span>'+s.done+' of '+s.total+' '+o.n+(s.total===1?'':'s')+'</span>'+(s.failed.length?'<span class="pill bad">'+s.failed.length+' failed</span>'+(s.ok?'<span class="pill ok">'+s.ok+' done</span>':''):(!s.running?'<span class="pill ok">Completed</span>':''))+'</div>';
  if(s.failed.length){h+='<div class="xf-fails">'+s.failed.slice(0,4).map(function(f){return '<div class="xf-fail"><b>'+esc(f.name)+'</b><span>'+esc(f.error)+'</span></div>'}).join('')+(s.failed.length>4?'<div class="muted" style="font-size:11px">+'+(s.failed.length-4)+' more</div>':'')+'</div>'}
  if(s.op==='download'&&!s.running&&s.ok>0&&s.dir){h+='<div class="dlsaved"><div class="dls-top"><span class="dls-lead">'+s.ok+' file'+(s.ok>1?'s':'')+' saved to your PC</span></div><code id="dlPath" class="dls-path" title="'+esc(s.dir)+'">'+esc(shortPath(s.dir))+'</code><div class="dls-acts"><button id="openDlFolder">Open folder</button><button id="copyDlPath" title="Copy folder path">Copy path</button></div></div>'}
  el.innerHTML=h;el.style.display='';
  var cx=$('xferClose');if(cx)cx.onclick=dismissXfer;
  var of=$('openDlFolder');if(of)of.onclick=function(){if(xferTimer){clearTimeout(xferTimer);xferTimer=null}of.disabled=true;of.textContent='Opening\u2026';bridge.send('/open-folder',{dir:s.dir}).then(function(r){if(r&&r.ok){of.textContent='Opened';setTimeout(function(){if($('openDlFolder')){of.disabled=false;of.textContent='Open folder'}},1600)}else{of.textContent='Couldn\u2019t open. Copy the path instead.';of.disabled=false}})};
  var cp=$('copyDlPath');if(cp)cp.onclick=function(){if(xferTimer){clearTimeout(xferTimer);xferTimer=null}var t=s.dir;try{navigator.clipboard.writeText(t)}catch(e){}cp.textContent='Copied';setTimeout(function(){if($('copyDlPath'))cp.textContent='Copy path'},1400)};
  if(xferTimer){clearTimeout(xferTimer);xferTimer=null}
  if(!s.running&&!s.failed.length){xferTimer=setTimeout(dismissXfer,(s.op==='download'&&s.dir)?9000:4500)}
}
function renderStats(){
  var el=$('stats');var s=state.s_stats;
  if(!s){el.innerHTML=containerOpen()?'<div class="empty">Set optional criteria above and click <b>Filter</b> to see live totals, a size histogram, a by-type breakdown and the largest blobs.</div>':'<div class="empty">'+cubeIc()+'Open a container first. Pick one from the tree on the left, then Filter its blobs.</div>';return}
  var maxb=Math.max.apply(null,s.buckets.map(function(x){return x.n}).concat([1]));
  var h='';
  if(containerOpen())h+='<div class="statscap"><span class="sc-dot"></span>Statistics for loaded blobs in <b>'+esc(state.s_container+(state.s_blobPrefix?'/'+state.s_blobPrefix:''))+'</b> <span class="sc-sep">\xB7</span> '+s.count+' blob'+(s.count===1?'':'s')+' matched in <b>'+esc(state.s_account)+'</b>'+(state.s_blobsMore?' (incomplete directory listing)':'')+'</div>';
  h+='<div class="metrics">'+metricCard('matched',String(s.count),'var(--accent)')+metricCard('total',s.totalh,'var(--text-2)')+metricCard('avg',s.avgh,'var(--accent)')+metricCard('largest',s.maxh,'var(--warn)')+'</div>';
  h+='<div class="chart">';
  h+='<div class="sect">Size distribution</div>'+s.buckets.map(function(bk){return brkBar(bk.label,bk.n/maxb,'<b>'+bk.n+'</b>',gradFor('size',bk.label))}).join('');
  h+=brkSection('By type',s.byType,'type');
  h+=brkSection('By access tier',s.byTier,'tier');
  h+=brkSection('By extension',s.byExt,'ext');
  if(s.topLargest&&s.topLargest.length){var mx=Math.max.apply(null,s.topLargest.map(function(x){return Number(x.size)||0}).concat([1]));
    h+='<div class="sect">Largest blobs</div>'+s.topLargest.map(function(t){var w=(Number(t.size)>0)?Math.max(6,Math.round(100*(Number(t.size)||0)/mx)):0;return '<div class="lrow"><i class="lfill" style="width:'+w+'%"></i><span class="lname" title="'+esc(t.name)+'">'+esc(t.name)+'</span><span class="lsize">'+esc(t.sizeh)+'</span></div>'}).join('');
  }
  h+='</div>';
  el.innerHTML=h;
}
function visualHtml(v){
  if(!v)return '';
  if(v.kind==='stat')return '<div class="stat" style="margin-top:10px"><b>'+esc(v.value)+'</b><span>'+esc(v.label||'')+'</span></div>';
  if(v.kind==='bar'&&v.items){var mx=Math.max.apply(null,v.items.map(function(x){return Number(x.value)||0}).concat([1]));return '<div style="margin-top:10px">'+v.items.map(function(x){var w=Math.round(100*(Number(x.value)||0)/mx);return '<div class="hbar"><span style="width:120px">'+esc(x.label)+'</span><div class="track"><i style="width:'+w+'%"></i></div><span>'+esc(x.value)+'</span></div>'}).join('')+'</div>'}
  if(v.kind==='table'&&v.rows){return '<table style="margin-top:10px">'+v.rows.map(function(r,i){var c=r.map(function(cell){return (i===0?'<th>':'<td>')+esc(cell)+(i===0?'</th>':'</td>')}).join('');return '<tr>'+c+'</tr>'}).join('')+'</table>'}
  return '';
}
function renderInsight(){
  var el=$('insight');if(!el)return;var ins=state.s_insight;
  if(!ins){el.innerHTML='';return}
  if(ins.pending){el.innerHTML='<div class="insight-box"><span class="muted">'+uiIcon('busy',{size:13,className:'spin'})+' Copilot is interpreting the statistics\u2026</span></div>';return}
  var h='<div class="insight-box"><div class="insight-head">'+uiIcon('insight')+' Copilot insight <button class="ix" id="insightX" title="Dismiss">'+uiIcon('clear')+'</button></div>';
  h+='<div>'+mdInline(ins.answer)+'</div>';
  h+=visualHtml(ins.visual);
  if(ins.suggestedFilter&&Object.keys(ins.suggestedFilter).length){
    var parts=[];var f=ins.suggestedFilter;
    if(f.olderThanDays!=null)parts.push('older than '+f.olderThanDays+'d');
    if(f.newerThanDays!=null)parts.push('newer than '+f.newerThanDays+'d');
    if(f.minSize!=null)parts.push('\u2265 '+fmtBytes(f.minSize));
    if(f.maxSize!=null)parts.push('\u2264 '+fmtBytes(f.maxSize));
    if(f.tiers)parts.push('tier '+[].concat(f.tiers).join('/'));
    if(f.type)parts.push('type '+f.type);
    if(f.namePattern)parts.push('name '+f.namePattern);
    var n=countMatch(f);var cnt=' <span class="sugcount">matches '+n+' of '+((state.s_blobs||[]).length)+'</span>';
    h+='<div class="insight-why">\u{1F4A1} Based on the analysis above, Copilot recommends this one-click filter to isolate the blobs worth acting on in <b>this</b> container.</div>';
    h+='<div class="insight-sug"><span class="muted">Suggested filter:</span> <b>'+esc(parts.join(' \xB7 ')||'custom')+'</b>'+cnt+'<button class="primary" id="applySug"'+(n===0?' disabled title="No blobs in this container match this filter"':'')+'>Apply filter</button></div>';
  }
  h+='</div>';
  el.innerHTML=h;
  if($('insightX'))$('insightX').onclick=function(){bridge.send('/dismiss-insight',{})};
  if($('applySug'))$('applySug').onclick=function(){var f=state.s_insight.suggestedFilter||{};syncFilterForm(f);bridge.send('/filter',f);var sb=$('applySug');if(sb){sb.disabled=true;sb.innerHTML=uiIcon('check')+' Applied'}};
}
function globOk(pat,name){pat=(''+pat).toLowerCase();name=(''+name).toLowerCase();
  if(pat.indexOf('*')===-1)return pat===name;
  var segs=pat.split('*');
  if(segs[0]&&name.slice(0,segs[0].length)!==segs[0])return false;
  var pos=segs[0].length;
  for(var i=1;i<segs.length;i++){var s=segs[i];if(!s)continue;
    if(i===segs.length-1){if(name.slice(name.length-s.length)!==s)return false;}
    else{var at=name.indexOf(s,pos);if(at===-1)return false;pos=at+s.length;}}
  return true;}
function countMatch(f){f=f||{};var b=state.s_blobs||[];if(!b.length)return 0;
  var min=(f.minSize!=null&&f.minSize!=='')?Number(f.minSize):null;
  var max=(f.maxSize!=null&&f.maxSize!=='')?Number(f.maxSize):null;
  var older=(f.olderThanDays!=null&&f.olderThanDays!=='')?Number(f.olderThanDays):null;
  var newer=(f.newerThanDays!=null&&f.newerThanDays!=='')?Number(f.newerThanDays):null;
  var tiers=f.tiers?[].concat(f.tiers).map(function(t){return String(t).toLowerCase()}):null;
  var pat=(f.namePattern&&String(f.namePattern).trim())?String(f.namePattern).trim():null;
  var DAY=86400000,now=Date.now();
  return b.filter(function(x){var sz=Number(x.size)||0;
    if(min!=null&&sz<min)return false;
    if(max!=null&&sz>max)return false;
    if(pat&&!globOk(pat,String(x.name||'')))return false;
    if(tiers&&tiers.indexOf(String(x.accessTier||'').toLowerCase())===-1)return false;
    if(older!=null||newer!=null){if(!x.lastModified)return false;var age=now-Date.parse(x.lastModified);if(older!=null&&!(age>older*DAY))return false;if(newer!=null&&!(age<=newer*DAY))return false;}
    return true;}).length;}
function metricCard(label,val,color){var v=String(val==null?'':val);var m=v.match(/^([d.,]+)s*(.*)$/);var main=m?m[1]:v;var unit=(m&&m[2])?' <small>'+esc(m[2])+'</small>':'';return '<div class="metric" style="--mc:'+color+'"><div class="mk"><span class="md"></span>'+esc(label)+'</div><div class="mv">'+esc(main)+unit+'</div></div>'}
function gradFor(kind,label){
  if(kind==='tier'){var t=String(label||'').toLowerCase();
    if(t.indexOf('hot')>=0)return 'linear-gradient(90deg,var(--warn),var(--text-3))';
    if(t.indexOf('archive')>=0)return 'linear-gradient(90deg,var(--text-3),var(--surface-3))';}
  return 'linear-gradient(90deg,var(--accent),var(--accent-soft))';
}
function brkBar(label,frac,valHtml,grad){var f=frac||0;var w=(f>0)?Math.max(3,Math.min(100,Math.round(100*f))):0;return '<div class="brow"><span class="blabel" title="'+esc(label)+'">'+esc(label)+'</span><div class="bwrap"><i class="bfill" style="width:'+w+'%;background:'+grad+'"></i><span class="bval">'+valHtml+'</span></div></div>'}
function brkSection(title,items,kind){if(!items||!items.length)return '';var maxb=Math.max.apply(null,items.map(function(x){return Number(x.bytes)||0}).concat([1]));return '<div class="sect">'+esc(title)+'</div>'+items.map(function(t){var lbl=(t.label==null||t.label===''||t.label==='\u2014')?'(untiered)':String(t.label);return brkBar(lbl,(Number(t.bytes)||0)/maxb,'<b>'+t.n+'</b> <span class="bmut">\xB7 '+esc(fmtBytes(t.bytes))+'</span>',gradFor(kind,lbl))}).join('')}
function sasPerm(on,label){return '<span class="pill '+(on?'ok':'')+'" style="'+(on?'':'opacity:.4')+'">'+uiIcon(on?'check':'clear')+label+'</span>'}
function permChip(on,label){return '<span class="perm '+(on?'on':'off')+'">'+(on?uiIcon('check',{className:'pi'}):uiIcon('lock',{className:'pi'}))+label+'</span>'}
function capChip(on,label,ic){return '<span class="cap '+(on?'on':'off')+'"><span class="ci">'+ic+'</span>'+label+(on?'':'<span class="lk">'+uiIcon('lock')+'</span>')+'</span>'}
function tierColor(t){var k=String(t||'').toLowerCase();if(k==='hot')return 'var(--warn)';if(k==='cool'||k==='cold')return 'var(--accent)';return 'var(--text-3)'}
function tierChip(t){if(!t)return '<span class="muted">\xB7</span>';var c=tierColor(t);return '<span class="tierpill"><span class="tdot" style="background:'+c+'"></span>'+esc(t)+'</span>'}
function expChipHtml(info){
  if(!info.expiresOn)return '<span class="expchip">no expiry</span>';
  var t=Date.parse(info.expiresOn);var d=String(info.expiresOn).slice(0,10);
  if(info.expired||(isFinite(t)&&t<Date.now()))return '<span class="expchip bad">'+uiIcon('warning')+' expired '+esc(d)+'</span>';
  if(isFinite(t)){var days=Math.round((t-Date.now())/86400000);if(days<=7)return '<span class="expchip warn">expires in '+days+'d ('+esc(d)+')</span>'}
  return '<span class="expchip">expires '+esc(d)+'</span>';
}
function renderSas(){
  var el=$('sas');var info=state.s_sasInfo;var blobs=state.s_sasBlobs||[];
  var sasPage=info&&(state.s_pages||{})[storagePageKey({account:info.account,kind:'sas',resource:info.container})];
  var selectionScope=JSON.stringify([info&&info.account,info&&info.container,sasPage&&sasPage.index]);if(selectionScope!==sasSelectionScope){sasSelected.clear();sasSelectionScope=selectionScope}
  sasSelected.forEach(function(name){if(!blobs.some(function(blob){return blob.name===name}))sasSelected.delete(name)});
  if(!info){el.innerHTML='<div class="empty">No SAS connected. Paste a container SAS URL above to connect.</div>';return}
  var st=state.s_sasStats;
  var h='<div class="sasconn">';
  h+='<div class="sashead"><div class="sasavatar">'+svgIcon('account')+'</div>';
  h+='<div class="sasid"><div class="sastitle"><b>'+esc(info.account)+'</b>'+uiIcon('forward',{className:'chev'})+cubeIc()+'<b>'+esc(info.container)+'</b></div><div class="sassub">Shared Access Signature \xB7 read-only connection</div></div>';
  h+='<div class="sasmeta"><span class="constatus"><span class="livedot"></span>Connected</span>'+expChipHtml(info)+'</div></div>';
  h+='<div class="permrow"><span class="plabel">Permissions</span><div class="caps">'+capChip(info.canRead,'Read',uiIcon('read'))+capChip(info.canList,'List',uiIcon('list'))+capChip(info.canWrite,'Write',uiIcon('edit'))+capChip(info.canDelete,'Delete',uiIcon('trash'))+'</div></div>';
  if(st){h+='<div class="sasm"><div class="c"><b>'+st.count+'</b><span>blobs</span></div><div class="c"><b>'+esc(st.totalh)+'</b><span>total size</span></div><div class="c"><b>'+esc(st.maxh)+'</b><span>largest</span></div></div>'}
  h+='</div>';
  if(!blobs.length){h+='<div class="empty" style="margin-top:10px">No blobs on this page.</div>';el.innerHTML=h;wireStoragePager(el,{account:info.account,kind:'sas',resource:info.container});return}
  var ft=sasFilterText.toLowerCase();
  var shown=blobs.filter(function(x){return !ft||String(x.name).toLowerCase().indexOf(ft)>-1});
  if(sasSort==='size')shown=shown.slice().sort(function(a,b){return (Number(b.size)||0)-(Number(a.size)||0)});
  else shown=shown.slice().sort(function(a,b){return String(a.name).localeCompare(String(b.name))});
  h+='<div class="vtool" style="margin:12px 0 8px"><input id="sasFilter" placeholder="Filter blobs by name" value="'+esc(sasFilterText)+'" style="flex:1"><button id="sasSortName">'+uiIcon('sort')+' Sort by name</button><button id="sasSortSize">'+uiIcon('sort')+' Sort by size</button><button id="sasSelectAll">'+uiIcon('select')+' Select all</button><button id="sasSelectNone">'+uiIcon('clear')+' Clear</button><button id="sasOpen">'+uiIcon('open')+' Open</button><button id="sasCopy">'+uiIcon('link')+' Copy link</button><button id="sasDlAll">'+uiIcon('download')+' Download selected</button></div>';
  h+='<div class="resource-list"><table class="sas-tbl" style="width:100%"><tr><th aria-label="Selection"></th><th>Name</th><th>Size</th><th>Modified</th><th>Tier</th></tr>';
  h+=shown.map(function(x){
    var mod=x.lastModified?String(x.lastModified).slice(0,10):'\xB7';
    var tier=tierChip(x.accessTier);
    return '<tr><td><input type="checkbox" data-sas-select="'+esc(x.name)+'" aria-label="Select '+esc(x.name)+'"'+(sasSelected.has(x.name)?' checked':'')+'></td><td class="fname">'+esc(x.name)+'</td><td>'+esc(fmtBytes(x.size))+'</td><td class="muted">'+esc(mod)+'</td><td>'+tier+'</td></tr>'
  }).join('')+'</table></div>';
  h+='<div id="sasDlMsg" class="dlmsg" style="display:none"></div>';
  el.innerHTML=h;
  wireStoragePager(el,{account:info.account,kind:'sas',resource:info.container});
  var fi=$('sasFilter');if(fi){fi.oninput=function(){sasFilterText=fi.value;var pos=fi.selectionStart;renderSas();var nf=$('sasFilter');if(nf){nf.focus();try{nf.setSelectionRange(pos,pos)}catch(e){}}}}
  if($('sasSortName'))$('sasSortName').onclick=function(){sasSort='name';renderSas()};
  if($('sasSortSize'))$('sasSortSize').onclick=function(){sasSort='size';renderSas()};
  function sasShowDl(dir,label){var m=$('sasDlMsg');if(!m)return;m.style.display='flex';m.innerHTML='<span class="ok">'+uiIcon('check')+' '+esc(label)+'</span>'+(dir?'<code class="dlpath">'+esc(dir)+'</code><span class="dlacts"><button id="sasOpenDir">'+uiIcon('folder')+' Open folder</button><button id="sasCopyDir">'+uiIcon('link')+' Copy path</button></span>':'');var od=$('sasOpenDir');if(od)od.onclick=function(){bridge.send('/open-folder',{dir:dir}).then(function(r){if(!r||!r.ok){state.s_error='Could not open download folder: '+(r&&r.error||dir);renderError()}})};var cd=$('sasCopyDir');if(cd)cd.onclick=function(){navigator.clipboard.writeText(dir).catch(function(error){state.s_error='Could not copy path: '+error.message;renderError()})}}
  function updateSasSelection(){var one=sasSelected.size===1&&blobs.find(function(blob){return sasSelected.has(blob.name)});$('sasOpen').disabled=$('sasCopy').disabled=!(one&&one.url);$('sasDlAll').disabled=sasDownloading||!sasSelected.size}
  Array.prototype.forEach.call(el.querySelectorAll('[data-sas-select]'),function(input){input.onchange=function(){if(input.checked)sasSelected.add(input.dataset.sasSelect);else sasSelected.delete(input.dataset.sasSelect);updateSasSelection()}});updateSasSelection();
  $('sasSelectAll').onclick=function(){shown.forEach(function(blob){sasSelected.add(blob.name)});renderSas()};
  $('sasSelectNone').onclick=function(){shown.forEach(function(blob){sasSelected.delete(blob.name)});renderSas()};
  $('sasOpen').onclick=function(){var blob=blobs.find(function(x){return sasSelected.has(x.name)});if(sasSelected.size===1&&blob&&blob.url)window.open(blob.url,'_blank','noopener')};
  $('sasCopy').onclick=function(){var blob=blobs.find(function(x){return sasSelected.has(x.name)});if(sasSelected.size===1&&blob&&blob.url)navigator.clipboard.writeText(blob.url).catch(function(error){state.s_error='Could not copy link: '+error.message;renderError()})};
  $('sasDlAll').onclick=async function(){if(sasDownloading||!sasSelected.size)return;var names=Array.from(sasSelected),source=state.s_sasUrl,dir=null;sasDownloading=true;updateSasSelection();for(var name of names){var result=state.s_sasUrl===source?await bridge.send('/sas-download',{name:name}):{ok:false,error:'SAS connection changed; remaining downloads stopped'};if(!result||!result.ok){sasDownloading=false;renderSas();state.s_error='Download failed: '+(result&&result.error||name);renderError();return}dir=result.dir}sasDownloading=false;renderSas();sasShowDl(dir,'Saved '+names.length+' file'+(names.length===1?'':'s')+' to')};
}
function renderTransfer(){
  var el=$('transfer');var t=state.s_transfer;
  $('xplanBtn').disabled=!!state.s_transferProgress;
  if(state.s_transferProgress){var progress=state.s_transferProgress;el.innerHTML='<div class="empty" role="status">'+uiIcon('busy',{size:13,className:'spin'})+' Reading complete '+esc(progress.side)+' inventory\u2026 '+Number(progress.count).toLocaleString()+' blobs read</div>';return}
  if(!t){
    if(state.s_transferErr){var warning=state.s_transferSeverity==='warning';el.innerHTML='<div class="xerr'+(warning?' xwarn':'')+'" role="'+(warning?'status':'alert')+'"><span class="xerr-ic">'+uiIcon('warning')+'</span><div><b>'+(warning?'Transfer planning limit':'Transfer plan failed')+'</b><div class="xerr-msg">'+esc(state.s_transferErr)+'</div></div></div>';return}
    el.innerHTML='';return}
  var p=t.plan;
  var conflictHi=p.conflictCount>0;
  var h='<div class="xplan">';
  h+='<div class="xroute"><span class="xep xep-src" title="Source"><span class="xep-ic">'+svgIcon('blob')+'</span><span class="xep-t">'+esc(t.sourceLabel)+'</span></span>';
  h+='<span class="xarrow">'+uiIcon('move')+'</span>';
  h+='<span class="xep xep-dst" title="Destination"><span class="xep-ic">'+svgIcon('blob')+'</span><span class="xep-t">'+esc(t.destLabel)+'</span></span>';
  h+='<span class="xpolicy xpol-'+esc(p.resolution)+'">'+uiIcon('policy',{size:12,style:'margin-right:4px'})+esc(p.resolution)+'</span></div>';
  h+='<div class="xmetrics">';
  h+='<div class="xmetric xm-accent"><div class="xm-v">'+p.transferCount+'</div><div class="xm-l">To transfer</div></div>';
  h+='<div class="xmetric"><div class="xm-v">'+esc(p.transferBytesh)+'</div><div class="xm-l">Total size</div></div>';
  h+='<div class="xmetric '+(conflictHi?'xm-warn':'')+'"><div class="xm-v">'+p.conflictCount+'</div><div class="xm-l">Conflicts</div></div>';
  h+='<div class="xmetric xm-ok"><div class="xm-v">'+p.newCount+'</div><div class="xm-l">New</div></div>';
  h+='<div class="xmetric"><div class="xm-v">'+p.skippedCount+'</div><div class="xm-l">Skipped</div></div>';
  h+='</div>';
  h+='<div class="xsub">'+esc(t.source)+' at source <span class="xdot">\xB7</span> '+p.destCount+' blob'+(p.destCount===1?'':'s')+' at destination</div>';
  var newerN=Math.max(0,p.transferCount-p.newCount);var keptN=Math.max(0,p.conflictCount-newerN);var pe='';var pcls='';
  if(p.resolution==='overwrite'){pcls='pe-ow';pe='<b>Overwrite:</b> all '+p.newCount+' new blob'+(p.newCount===1?'':'s')+' plus all '+p.conflictCount+' existing (conflicting) blob'+(p.conflictCount===1?'':'s')+' will be re-uploaded, replacing the destination copies. Nothing is skipped.'}
  else if(p.resolution==='skip'){pcls='pe-skip';pe='<b>Skip existing:</b> only the '+p.newCount+' new blob'+(p.newCount===1?'':'s')+' transfer'+(p.newCount===1?'s':'')+'. The '+p.conflictCount+' blob'+(p.conflictCount===1?'':'s')+' that already exist at the destination are left untouched.'}
  else{pcls='pe-ifn';pe='<b>If source newer:</b> new blobs always transfer; a conflicting blob transfers only if the source copy is newer than the destination. Here '+newerN+' of '+p.conflictCount+' '+(newerN===1?'is':'are')+' newer (will replace), and '+keptN+' '+(keptN===1?'is':'are')+' not newer (kept). '+(newerN===0?'That is why the totals match <b>Skip</b> for this data.':'')}
  h+='<div class="xexplain '+pcls+'">'+uiIcon('policy',{size:12,style:'margin-right:4px'})+'<span>'+pe+'</span></div>';
  h+='</div>';
  if(p.conflicts&&p.conflicts.length){
    var actLabel=p.resolution==='overwrite'?'Overwrite':(p.resolution==='skip'?'Skip':'If newer');
    var actCls=p.resolution==='overwrite'?'act-ow':(p.resolution==='skip'?'act-skip':'act-ifn');
    h+='<div class="xconf"><div class="xconf-h"><span class="xconf-badge">'+p.conflictCount+'</span> conflicting blob'+(p.conflictCount===1?'':'s')+', resolved by <b>'+esc(p.resolution)+'</b></div>';
    h+='<table class="xtbl"><thead><tr><th>Name</th><th>Source size</th><th>Modified</th><th>Action</th></tr></thead><tbody>';
    h+=p.conflicts.map(function(c){var mod=c.lastModified?String(c.lastModified).slice(0,10):'\xB7';return '<tr><td class="fname">'+esc(c.name)+'</td><td>'+esc(c.sizeh)+'</td><td class="muted">'+esc(mod)+'</td><td><span class="xact '+actCls+'">'+actLabel+'</span></td></tr>'}).join('');
    h+='</tbody></table></div>';
  }
  h+='<div class="xcmd-card"><div class="xcmd-head"><span class="xcmd-title">'+uiIcon('terminal',{size:13,style:'margin-right:6px'})+'AzCopy command</span>'+(t.needsLogin?'<span class="xchip xchip-warn" title="an endpoint has no SAS token">'+uiIcon('lock',{size:11,style:'margin-right:4px'})+'Sign-in required</span>':'<span class="xchip xchip-ok">'+uiIcon('check',{size:11,style:'margin-right:4px'})+'Ready to run</span>')+'<button class="xcopy" id="xcopyBtn">'+uiIcon('copy',{size:12,style:'margin-right:5px'})+'Copy</button></div>';
  h+='<pre class="xcmd" id="xcmd">'+esc(t.command.replace(/([?&]sig=)[^&\\s"]*/gi,'$1[hidden]'))+'</pre>';
  if(/[?&]sig=/.test(t.command))h+='<div class="xnote">'+uiIcon('info',{size:13,style:'flex:0 0 auto;margin-top:1px'})+'<span>SAS signatures are hidden here. Copy includes the full credentials; keep the command private.</span></div>';
  if(t.needsLogin)h+='<div class="xnote">'+uiIcon('info',{size:13,style:'flex:0 0 auto;margin-top:1px'})+'<span>An endpoint has no SAS token. Run <code>azcopy login</code> first, or use SAS URLs for both source and destination. Nothing moves until you run this command.</span></div>';
  else h+='<div class="xnote">'+uiIcon('info',{size:13,style:'flex:0 0 auto;margin-top:1px'})+'<span>Copy and run in your terminal. Nothing moves until you run it.</span></div>';
  if(t.azcopy&&t.azcopy.installed)h+='<div class="xnote">'+uiIcon('check',{size:11,style:'margin-right:4px'})+'<span>AzCopy '+esc(t.azcopy.version||'')+' detected on your PATH.</span></div>';
  else if(t.azcopy)h+='<div class="xnote xnote-warn">'+uiIcon('lock',{size:11,style:'margin-right:4px'})+'<span>'+esc(t.azcopy.hint||'AzCopy is required to run this command.')+' Install it from <a href="https://aka.ms/downloadazcopy" target="_blank" rel="noopener">aka.ms/downloadazcopy</a>, then re-open the plan.</span></div>';
  h+='</div>';
  el.innerHTML=h;
  if($('xcopyBtn'))$('xcopyBtn').onclick=function(){var txt=t.command;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt)}else{var r=document.createRange();r.selectNode($('xcmd'));var s=window.getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy')}catch(e){}}$('xcopyBtn').innerHTML=uiIcon('check')+' Copied';setTimeout(function(){if($('xcopyBtn'))$('xcopyBtn').innerHTML=uiIcon('copy',{size:12,style:'margin-right:5px'})+'Copy command'},1500)};
}
function renderAsk(){
  var el=$('resourceAnnotation');var a=state.s_ask;
  el.innerHTML=a&&!a.pending&&a.answer?'<section class="agent-note"><h3>Agent notes</h3>'+mdInline(a.answer)+visualHtml(a.visual)+'</section>':'';
}
function renderLog(){var el=$('log');var lines=(state.activityLog||[]);el.textContent=lines.slice(-40).join('\\n');el.scrollTop=el.scrollHeight}

Array.prototype.forEach.call(document.querySelectorAll('.card-head'),function(head){
  head.setAttribute('role','button');head.tabIndex=0;head.setAttribute('aria-expanded',String(!head.parentNode.classList.contains('min')));
  head.onclick=function(){head.parentNode.classList.toggle('min');head.setAttribute('aria-expanded',String(!head.parentNode.classList.contains('min')))};
  head.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();head.click()}};
});

function expandSide(){var side=$('side'),shell=$('shell');side.classList.remove('collapsed');shell.classList.remove('collapsed');$('sideToggle').innerHTML=uiIcon('collapse')}
$('sideToggle').onclick=function(){
  var side=$('side'),shell=$('shell');
  side.classList.toggle('collapsed');shell.classList.toggle('collapsed');
  $('sideToggle').innerHTML=side.classList.contains('collapsed')?uiIcon('expand'):uiIcon('collapse');
};
(function buildRail(){
  var r=$('sideRail');if(!r)return;
  r.innerHTML='';
})();
$('refreshBtn').onclick=async function(){
  var failed={};(state.s_subscriptionErrors||[]).forEach(function(e){failed[e.subscriptionId]=true});
  var ids=(state.s_selectedSubs||[]).filter(function(id){
    var sub=(state.s_subscriptions||[]).find(function(s){return s.subscriptionId===id});
    return sub&&!failed[id]&&!hiddenSubscriptions[id]&&!hiddenTenants[sub.tenantId];
  });
  var result=await bridge.send('/load-subscriptions',{});
  if(result&&result.ok&&ids.length)bridge.send('/select-subscriptions',{subscriptionIds:ids});
};
$('treeSearch').oninput=function(){treeQuery=$('treeSearch').value;renderTree()};


// \u2500\u2500 confirm / prompt dialog (guards every mutation) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var cfResolve=null,cfValidate=null;
function askConfirm(opts){
  return new Promise(function(resolve){
    cfResolve=resolve;
    $('cfTitle').textContent=opts.title||'Confirm';
    $('cfMsg').textContent=opts.msg||'';
    $('cfInputWrap').style.display=opts.input?'':'none';
    $('cfInput').value=opts.value||'';
    $('cfInput').rows=opts.rows||1;
    $('cfOk').textContent=opts.okLabel||'OK';
    $('cfOk').className=opts.danger?'danger':'primary';
    cfValidate=opts.validate||null;$('cfError').textContent='';
    $('confirmOverlay').classList.add('open');
    if(opts.input)setTimeout(function(){$('cfInput').focus();$('cfInput').select()},0);
  });
}
function cfClose(val){$('confirmOverlay').classList.remove('open');var r=cfResolve;cfResolve=null;if(r)r(val)}
$('cfCancel').onclick=function(){cfClose(null)};
$('cfOk').onclick=function(){var val=$('cfInputWrap').style.display==='none'?true:$('cfInput').value;var error=cfValidate?cfValidate(val):'';if(error){$('cfError').textContent=error;$('cfInput').focus();return}cfClose(val)};
$('cfInput').onkeydown=function(e){if(e.key==='Enter'&&e.metaKey===false&&$('cfInput').rows==1){e.preventDefault();$('cfOk').click()}if(e.key==='Escape')cfClose(null)};
$('confirmOverlay').onclick=function(e){if(e.target===$('confirmOverlay'))cfClose(null)};

// \u2500\u2500 Table entity form (friendly, no raw JSON) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function entPropRow(name,type,val){
  var opt=function(t){return '<option'+(type===t?' selected':'')+'>'+t+'</option>'};
  return '<div class="entrow"><input class="epn" placeholder="property name" value="'+esc(name||'')+'"><select class="ept">'+opt('String')+opt('Number')+opt('Boolean')+'</select><input class="epv" placeholder="value" value="'+esc(val==null?'':String(val))+'"><button class="rowact del epx" title="Remove">'+uiIcon('clear')+'</button></div>';
}
function entInferType(v){if(typeof v==='boolean')return 'Boolean';if(typeof v==='number')return 'Number';return 'String'}
function entAddPropRow(name,type,val){
  var wrap=document.createElement('div');wrap.innerHTML=entPropRow(name,type,val);var node=wrap.firstChild;
  $('entProps').appendChild(node);
  node.querySelector('.epx').onclick=function(){node.remove()};
}
function openEntityForm(existing){
  $('entTitle').textContent=existing?'Edit entity':'Add entity';
  $('entErr').textContent='';
  $('entPK').value=existing?(existing.partitionKey||''):'';
  $('entRK').value=existing?(existing.rowKey||''):'';
  $('entPK').readOnly=!!existing;$('entRK').readOnly=!!existing;
  $('entProps').innerHTML='';
  if(existing){Object.keys(existing).forEach(function(key){if(key==='partitionKey'||key==='rowKey'||key==='timestamp'||key==='etag'||key.indexOf('odata.')===0)return;entAddPropRow(key,entInferType(existing[key]),existing[key])})}
  if(!$('entProps').children.length)entAddPropRow('','String','');
  $('entityOverlay').classList.add('open');
  setTimeout(function(){$(existing?'entProps':'entPK').focus()},0);
}
function closeEntityForm(){$('entityOverlay').classList.remove('open')}
function saveEntityForm(){
  var pk=$('entPK').value.trim(),rk=$('entRK').value.trim();
  if(!pk||!rk){$('entErr').textContent='PartitionKey and RowKey are required.';return}
  var ent={partitionKey:pk,rowKey:rk};var bad='';
  Array.prototype.forEach.call($('entProps').querySelectorAll('.entrow'),function(r){
    var n=r.querySelector('.epn').value.trim();if(!n)return;
    if(n==='partitionKey'||n==='rowKey')return;
    var t=r.querySelector('.ept').value,raw=r.querySelector('.epv').value,v;
    if(t==='Number'){if(raw===''){v=0}else{v=Number(raw);if(isNaN(v)){bad=n;return}}}
    else if(t==='Boolean'){v=(raw==='true'||raw==='True'||raw==='1')}
    else{v=raw}
    ent[n]=v;
  });
  if(bad){$('entErr').textContent='Property "'+bad+'" is not a valid number.';return}
  bridge.send('/entity-upsert',{table:state.s_item,entity:ent});
  closeEntityForm();
}
$('entAddProp').onclick=function(){entAddPropRow('','String','')};
$('entCancel').onclick=closeEntityForm;
$('entClose').onclick=closeEntityForm;
$('entSave').onclick=saveEntityForm;
$('entityOverlay').onclick=function(e){if(e.target===$('entityOverlay'))closeEntityForm()};

// \u2500\u2500 SAS generator (create a shareable, time-limited SAS for a blob or container) \u2500
var sasGenName=null;var sasGenContainer=null;var sasScope='blob';var sasGenMinutes=1440;
function sasResetCommon(){
  sasGenMinutes=1440;
  Array.prototype.forEach.call(document.querySelectorAll('.sgchip'),function(c){c.classList.toggle('active',c.getAttribute('data-min')==='1440')});
  $('sgResult').style.display='none';$('sgResult').innerHTML='';
  $('sgErr').textContent='';$('sgGo').disabled=false;$('sgGo').textContent='Generate link';
  $('sasOverlay').classList.add('open');
}
function openSasGen(name){
  sasScope='blob';sasGenName=name;
  $('sgTitle').textContent='Create SAS link';
  $('sgSub').textContent='A secure, time-limited URL for the blob "'+name+'". No Azure login needed to use it.';
  $('sgpLwrap').style.display='none';$('sgpL').checked=false;
  $('sgpR').checked=true;$('sgpW').checked=false;$('sgpD').checked=false;
  sasResetCommon();
}
function openContainerSas(){
  var c=state.s_container;if(!c)return;
  sasScope='container';sasGenContainer=c;
  $('sgTitle').textContent='Share container (SAS)';
  $('sgSub').textContent='A secure, time-limited URL to browse & download everything in the container "'+c+'". Share it, or paste it into the Instant SAS tab / Storage Explorer.';
  $('sgpLwrap').style.display='';$('sgpL').checked=true;
  $('sgpR').checked=true;$('sgpW').checked=false;$('sgpD').checked=false;
  sasResetCommon();
}
function closeSasGen(){$('sasOverlay').classList.remove('open')}
Array.prototype.forEach.call(document.querySelectorAll('.sgchip'),function(c){c.onclick=function(){Array.prototype.forEach.call(document.querySelectorAll('.sgchip'),function(x){x.classList.remove('active')});c.classList.add('active');sasGenMinutes=Number(c.getAttribute('data-min'))||1440}});
$('sgGo').onclick=function(){
  var isC=sasScope==='container';
  var perms=($('sgpR').checked?'r':'')+((isC&&$('sgpL').checked)?'l':'')+($('sgpW').checked?'w':'')+($('sgpD').checked?'d':'');
  if(!perms){$('sgErr').textContent='Pick at least one permission.';return}
  $('sgErr').textContent='';var b=$('sgGo');b.disabled=true;b.textContent='Generating\u2026';
  var route=isC?'/generate-container-sas':'/generate-sas';
  var payload=isC?{container:sasGenContainer,minutes:sasGenMinutes,permissions:perms}:{name:sasGenName,minutes:sasGenMinutes,permissions:perms};
  bridge.send(route,payload).then(function(r){
    b.disabled=false;b.textContent='Generate link';
    if(!r||!r.ok){$('sgErr').textContent='Failed: '+((r&&r.error)||'unknown error');return}
    var exp=r.expiresOn?new Date(r.expiresOn).toLocaleString():'';
    var modeTxt=r.mode==='user-delegation'?'User delegation (AAD)':'Account key';
    var scopeTxt=isC?'Container':'Blob';
    var res=$('sgResult');res.style.display='';
    res.innerHTML='<div class="sgok">SAS ready<span class="sgbadge">'+scopeTxt+'</span><span class="sgbadge">expires '+esc(exp)+'</span><span class="sgbadge">'+esc(modeTxt)+'</span></div><textarea id="sgUrl" class="sgurl" readonly rows="3"></textarea><div class="flex" style="gap:8px;margin-top:9px"><button id="sgCopy">Copy link</button><button id="sgOpen">Open</button></div>';
    var u=$('sgUrl');u.value=r.url;setTimeout(function(){u.focus();u.select()},0);
    $('sgCopy').onclick=function(){try{navigator.clipboard.writeText(r.url)}catch(e){}var cb=$('sgCopy');cb.textContent='Copied';setTimeout(function(){if($('sgCopy'))cb.textContent='Copy link'},1400)};
    $('sgOpen').onclick=function(){var ou=r.url;if(isC)ou=r.url+'&restype=container&comp=list';window.open(ou,'_blank')};
  });
};
$('sgCancel').onclick=closeSasGen;
$('sgClose').onclick=closeSasGen;
$('sasOverlay').onclick=function(e){if(e.target===$('sasOverlay'))closeSasGen()};

// category \uFF0B create (Blob Containers / File Shares / Queues / Tables)
function createInCategory(kind,account){
  account=account||state.s_account;if(!account)return;
  var label=kind==='blob'?'blob container':kind==='queue'?'queue':kind==='table'?'table':'file share';
  askConfirm({title:'New '+label,msg:'Name for the new '+label+':',input:true,okLabel:'Create',validate:function(name){
    name=String(name||'').trim();if(!name)return 'Enter a name.';
    var tree=(state.s_tree||{})[account]||{},items=kind==='blob'?tree.containers:kind==='file'?tree.shares:kind==='queue'?tree.queues:tree.tables;
    if((items||[]).some(function(x){return x.name.toLowerCase()===name.toLowerCase()}))return 'A '+label+' named "'+name+'" already exists. Choose a different name.';
    return '';
  }}).then(function(name){
    name=(name||'').trim();if(!name)return;
    if(kind==='blob')bridge.send('/container-create',{container:name,account:account});
    else if(kind==='queue')bridge.send('/queue-create',{queue:name,account:account});
    else if(kind==='table')bridge.send('/table-create',{table:name,account:account});
    else bridge.send('/share-create',{share:name,account:account});
  });
}
// item \u{1F5D1} delete (category leaf)
function deleteItem(kind,name,account){
  account=account||state.s_account;
  var label=kind==='blob'?'container':kind==='queue'?'queue':kind==='table'?'table':'file share';
  askConfirm({title:'Delete '+label,msg:'Permanently delete '+label+' "'+name+'"? This cannot be undone.',okLabel:'Delete',danger:true}).then(function(ok){
    if(!ok)return;
    if(kind==='blob')bridge.send('/container-delete',{container:name,account:account});
    else if(kind==='queue')bridge.send('/queue-delete',{queue:name,account:account});
    else if(kind==='table')bridge.send('/table-delete',{table:name,account:account});
    else bridge.send('/share-delete',{share:name,account:account});
  });
}

function containerOpen(){return state.s_kind==='blob'&&!!state.s_container}
function cubeIc(){return svgIcon('blob')}
function acctIc(){return svgIcon('account')}
function needContainerHint(){$('stats').innerHTML='<div class="empty">'+cubeIc()+'Open a container first. Pick one from the tree on the left, then Filter its blobs.</div>'}
$('filterBtn').onclick=function(){
  if(!containerOpen()){needContainerHint();return}
  var crit={namePattern:$('fName').value,minSize:$('fMin').value,maxSize:$('fMax').value,olderThanDays:$('fOlder').value,newerThanDays:$('fNewer').value,type:$('fType').value,tiers:$('fTier').value,blobTypes:$('fBlobType').value};
  var tag=$('fTag').value.trim();
  var applied=state.s_criteria||{};
  if(tag&&tag===filterTagText(applied)){if(applied.tags)crit.tags=applied.tags;if(applied.tagKeys)crit.tagKeys=applied.tagKeys}
  else if(tag){var eq=tag.indexOf('=');if(eq>-1){var o={};o[tag.slice(0,eq).trim()]=tag.slice(eq+1).trim();crit.tags=o}else{crit.tagKeys=tag}}
  bridge.send('/filter',crit);
};
function filterTagText(f){
  return [].concat(f.tagKeys||[]).concat(Object.keys(f.tags||{}).map(function(key){return key+'='+f.tags[key]})).join(', ');
}
function syncFilterForm(f){
  f=f||{};
  function setV(id,v){var e=$(id),value=v==null?'':String(v);if(e&&e.value!==value)e.value=value}
  function setList(id,v){
    var e=$(id),value=[].concat(v||[]).join(',');
    Array.prototype.forEach.call(e.querySelectorAll('[data-applied-filter]'),function(option){option.remove()});
    if(value&&!Array.prototype.some.call(e.options,function(option){return option.value===value})){
      var option=document.createElement('option');option.value=value;option.textContent=value;option.dataset.appliedFilter='true';e.append(option);
    }
    setV(id,value);
  }
  setV('fName',f.namePattern);
  setV('fMin',f.minSize);
  setV('fMax',f.maxSize);
  setV('fOlder',f.olderThanDays);
  setV('fNewer',f.newerThanDays);
  setV('fType',f.type||'all');
  setList('fTier',f.tiers);
  setList('fBlobType',f.blobTypes);
  setV('fTag',filterTagText(f));
}
$('dlFilteredBtn').onclick=function(){if(!containerOpen()){needContainerHint();return}bridge.send('/download-filtered',{})};
function filteredCount(){return (state.s_filtered||[]).length}
function cleanupSummary(){var n=filteredCount();var sz=(state.s_stats&&state.s_stats.totalh)?state.s_stats.totalh:'';return n+' matched blob'+(n===1?'':'s')+(sz?' ('+sz+')':'')}
function needMatchedHint(){$('stats').innerHTML='<div class="empty">Click <b>Filter</b> first so there is a matched set to clean up.</div>'}
$('archiveFilteredBtn').onclick=function(){if(!containerOpen()){needContainerHint();return}if(!filteredCount()){needMatchedHint();return}askConfirm({title:'Move to Archive tier',msg:'Move '+cleanupSummary()+' to the Archive tier? This cuts storage cost and is reversible, you can rehydrate anytime.',okLabel:'Move to Archive'}).then(function(ok){if(ok)bridge.send('/cleanup-filtered',{action:'archive'})})};
$('deleteFilteredBtn').onclick=function(){if(!containerOpen()){needContainerHint();return}if(!filteredCount()){needMatchedHint();return}askConfirm({title:'Permanently delete matched blobs',msg:'Permanently delete '+cleanupSummary()+'? This cannot be undone.',okLabel:'Delete',danger:true}).then(function(ok){if(ok)bridge.send('/cleanup-filtered',{action:'delete'})})};
$('insightBtn').onclick=function(){if(!containerOpen()){needContainerHint();return}if(!state.s_stats){$('stats').innerHTML='<div class="empty">Click <b>Filter</b> first so there are statistics for Copilot to explain.</div>';return}bridge.send('/insights',{})};
$('sasBtn').onclick=function(){bridge.send('/sas-connect',{url:$('sasIn').value})};
function xShowErr(msg,severity){state.s_transferErr=msg;state.s_transferSeverity=severity||'error';state.s_transfer=null;renderTransfer();var e=$('transfer');if(e){var box=e.querySelector('.xerr');(box||e).scrollIntoView({behavior:'smooth',block:'center'})}}
$('xplanBtn').onclick=function(){
  var isPick=xDestMode==='pick';
  var dest;
  if(isPick){
    if(!xDestAcct||!xDestCont){xShowErr('Pick a destination account and container, or choose SAS URL.');return}
    dest=xDestAcct+'/'+xDestCont;
  }else{
    dest=($('xdest').value||'').trim();
    if(!/[?&]sig=/.test(dest)){xShowErr('Enter a destination container SAS URL.');$('xdest').focus();return}
  }
  var isSas2=/[?&]sig=/.test(dest);
  var sourceSas=xSourceMode==='sas'?($('xsrcsas').value||'').trim():'';
  if(xSourceMode==='sas'&&!sourceSas){xShowErr('Enter a source container SAS URL.');$('xsrcsas').focus();return}
  if(xSourceMode==='pick'&&!state.s_account){xShowErr('Open a storage account first, or choose a source SAS URL.');return}
  if(xSourceMode==='pick'&&!xSourceCont){xShowErr('Choose a source container from the Source dropdown.');return}
  if(!dest){xShowErr('Enter a destination: '+String.fromCharCode(39)+'account/container'+String.fromCharCode(39)+' (e.g. '+esc(state.s_account||'myaccount')+'/backups) or a container SAS URL.');if(!isPick)$('xdest').focus();return}
  if(!isPick&&!isSas2&&dest.replace('https://','').replace('http://','').split('/').filter(function(x){return x}).length<2){xShowErr('Destination must be '+String.fromCharCode(39)+'account/container'+String.fromCharCode(39)+', not just '+String.fromCharCode(39)+dest+String.fromCharCode(39)+'. Try '+esc(state.s_account||'myaccount')+'/'+dest+', or paste a container SAS URL.');$('xdest').focus();return}
  var res='overwrite';Array.prototype.forEach.call(document.getElementsByName('xres'),function(r){if(r.checked)res=r.value});
  state.s_transferErr=null;state.s_error=null;renderError();$('transfer').innerHTML='<div class="empty">'+uiIcon('busy',{size:13,className:'spin'})+' Planning transfer\u2026</div>';
  $('transfer').scrollIntoView({behavior:'smooth',block:'center'});
  var p=bridge.send('/transfer-plan',{dest:dest,resolution:res,useFiltered:$('xfiltered').checked,source:xSourceMode==='pick'?xSourceCont:undefined,sourceSas:sourceSas||undefined});
  if(p&&p.then)p.then(function(r){if(r&&r.ok===false)xShowErr(r.error||'Transfer plan failed.',r.severity)});
};
$('hubSasBtn').onclick=function(){openContainerSas()};
render();
`,FEEDBACK_BASE="https://github.com/microsoft/azure-dev-tools/issues/new";function buildFeedbackUrl(info){let title="Azure Storage canvas feedback",body=`Product: Azure Storage
Canvas: azure-storage
Version: `+info.version+`
Revision: `+info.revision+`

## Feedback

`;return(FEEDBACK_BASE+"?title="+encodeURIComponent(title)+"&body="+encodeURIComponent(body)).replace(/&/g,"&amp;")}function escAttr(s){return String(s??"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}var BUILD_STAMP_HTML='<span class="build-stamp" title="Build metadata fingerprints the extension entry file"><span class="bs-ver">v'+escAttr(BUILD_INFO.version)+"+"+escAttr(BUILD_INFO.revision)+"</span></span>",FEEDBACK_HTML='<a class="feedback-link" href="'+buildFeedbackUrl(BUILD_INFO)+'" target="_blank" rel="noopener noreferrer">Send feedback</a>',BODY_WITH_IDENTITY=BODY.replace("<!--FOOTER-->","").replace("<!--BUILD-STAMP-->",BUILD_STAMP_HTML).replace("<!--FEEDBACK-->",FEEDBACK_HTML);function pageHtml(nonce){let n=nonce?' nonce="'+nonce+'"':"";return'<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light dark"><title>Azure Storage</title><style>'+CSS+"</style></head><body>"+BODY_WITH_IDENTITY+'<script type="module"'+n+">"+CLIENT+"</script></body></html>"}import{randomUUID}from"node:crypto";import{execFile as execFile3}from"node:child_process";var ID=/^[a-z][a-z0-9_.-]{0,79}$/,VERSION=/^[a-zA-Z0-9][a-zA-Z0-9.+_-]{0,39}$/,SOURCES=new Set(["model","panel","system","unknown"]),CONTROL_TYPES=new Set(["button","link","select","input","textarea","details","other"]),INTERACTIONS=new Set(["click","change","submit"]),FAILURE_CODES=Object.freeze({succeeded:"",failed:"action_error",rejected:"action_rejected",cancelled:"action_cancelled"}),RESERVED=new Set(["__proto__","constructor","prototype"]),USAGE_ENVELOPE_SCHEMA_VERSION=2,DEFAULT_REQUEST_TIMEOUT_MS=1e4,PUBLIC_CANVAS_USAGE_SERVICE=Object.freeze({serviceId:"public-canvas-product-usage",schemaVersion:USAGE_ENVELOPE_SCHEMA_VERSION,dataClassification:"pseudonymous_product_usage",endpoint:"https://canvas-metrics-pilot-0b8944-add3hsghhddcbxe9.b01.azurefd.net/api/events"}),PUBLIC_CANVAS_USAGE_ENDPOINT=PUBLIC_CANVAS_USAGE_SERVICE.endpoint,GITHUB_USER_ID=/^[1-9][0-9]{0,19}$/;function githubCliEnvironment(source){let env={...source};for(let key of Object.keys(env))["GH_TOKEN","GITHUB_TOKEN"].includes(key.toUpperCase())&&delete env[key];return env}function runFile(command,args,options,execFileImpl){return new Promise((resolve,reject)=>{execFileImpl(command,args,options,(error,stdout)=>{error?reject(error):resolve(stdout)})})}async function resolveGitHubCliUserId({signal,env=process.env,execFileImpl=execFile3}={}){if(typeof execFileImpl!="function")throw new TypeError("GitHub CLI executor must be a function.");let stdout;try{stdout=await runFile("gh",["api","--hostname","github.com","user","--jq",".id"],{env:githubCliEnvironment(env),signal,timeout:5e3,maxBuffer:1024,windowsHide:!0},execFileImpl)}catch{throw new Error("GitHub identity is unavailable.")}let githubUserId=String(stdout).trim();if(!GITHUB_USER_ID.test(githubUserId))throw new Error("GitHub identity is unavailable.");return githubUserId}function identifier(value,label,pattern=ID){if(typeof value!="string"||!pattern.test(value)||RESERVED.has(value))throw new TypeError(`${label} must be a bounded, code-defined identifier.`);return value}function record(value,label){if(!value||typeof value!="object"||![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw new TypeError(`${label} must be a plain record.`);return value}function integer(value,min,max,label){if(!Number.isSafeInteger(value)||value<min||value>max)throw new TypeError(`${label} must be an integer from ${min} to ${max}.`);return value}function endpoint(value){try{let url=new URL(value);if(url.protocol==="https:"&&!url.username&&!url.password&&!url.search&&!url.hash)return url.href}catch{}throw new TypeError("Telemetry endpoint must be credential-free HTTPS without a query or fragment.")}function createCanvasUsageMetrics(options={}){return createUsageMetrics(options)}function createUsageMetrics(options,skillContract){let{contract,canvasVersion,releaseChannel="development",enabled=!1,endpoint:destination,audience,getAccessToken,transport,fetchImpl=globalThis.fetch,getGitHubUserId,now=Date.now,randomId=randomUUID,onDiagnostic,batchSize=20,maxQueueSize=100,flushIntervalMs=1e3,requestTimeoutMs=DEFAULT_REQUEST_TIMEOUT_MS,closeTimeoutMs=DEFAULT_REQUEST_TIMEOUT_MS}=options;if(contract!==void 0&&(record(contract,"contract"),["canvasId","host","actionUsage","controls"].some(key=>Object.hasOwn(options,key))))throw new TypeError("Contract identity and registries cannot be overridden.");let canvasId=contract?.canvasId??options.canvasId,host=contract?.host??options.host??"copilot_app",actionUsage=contract?.actions??options.actionUsage??{},controls=contract?.controls??options.controls??{};if(identifier(canvasId,"canvasId"),identifier(canvasVersion,"canvasVersion",VERSION),!["copilot_app","mcp_app"].includes(host))throw new TypeError("Unsupported telemetry host.");if(contract!==void 0){if(!Array.isArray(contract.versions)||!contract.versions.length||contract.versions.some(version=>typeof version!="string"||!VERSION.test(version)))throw new TypeError("Contract versions must be bounded version identifiers.");if(!contract.versions.includes(canvasVersion))throw new TypeError("Canvas version is not registered by the telemetry contract.")}if(!["development","internal","preview","stable"].includes(releaseChannel))throw new TypeError("Unsupported telemetry release channel.");if(typeof enabled!="boolean")throw new TypeError("enabled must be a boolean.");let url=destination===void 0&&(!enabled||transport!==void 0)?void 0:endpoint(destination);for(let[name,fn]of Object.entries({now,randomId}))if(typeof fn!="function")throw new TypeError(`${name} must be a function.`);if(transport!==void 0&&typeof transport!="function")throw new TypeError("transport must be a function.");if(getAccessToken!==void 0&&typeof getAccessToken!="function")throw new TypeError("getAccessToken must be a function.");if(enabled&&!transport&&typeof fetchImpl!="function")throw new TypeError("fetchImpl must be a function.");if(getGitHubUserId!==void 0&&typeof getGitHubUserId!="function")throw new TypeError("getGitHubUserId must be a function.");if(audience!==void 0&&(typeof audience!="string"||!audience.trim()||audience.length>512||/[\r\n]/.test(audience)))throw new TypeError("audience must be a bounded nonempty string.");if(onDiagnostic!==void 0&&typeof onDiagnostic!="function")throw new TypeError("onDiagnostic must be a function.");integer(batchSize,1,100,"batchSize"),integer(maxQueueSize,batchSize,1e3,"maxQueueSize"),integer(flushIntervalMs,10,6e4,"flushIntervalMs"),integer(requestTimeoutMs,10,3e4,"requestTimeoutMs"),integer(closeTimeoutMs,10,3e4,"closeTimeoutMs");let actions=new Map(Object.entries(record(actionUsage,"actionUsage")).map(([name,entry])=>{if(identifier(name,"action name"),record(entry,"action usage"),identifier(entry.featureId,"featureId"),identifier(entry.featureArea,"featureArea"),!["intentional","automatic","excluded"].includes(entry.usageClass)||typeof entry.mutates!="boolean")throw new TypeError("Action usage requires a supported usageClass and boolean mutates.");return[name,Object.freeze({featureId:entry.featureId,featureArea:entry.featureArea,usageClass:entry.usageClass,mutates:entry.mutates})]})),controlRegistry=new Map(Object.entries(record(controls,"controls")).map(([id,type])=>{if(identifier(id,"control ID"),!CONTROL_TYPES.has(type))throw new TypeError("Unsupported telemetry control type.");return[id,type]})),queue=[],stats={delivered:0,dropped:0,invalid:0},reported=new Set,shutdown=new AbortController,timer,activeFlush,activeController,closePromise,inFlight=0,closing=!1,resolvedGitHubUserId;function diagnose(code){if(reported.has(code))return;reported.add(code);let warn=message=>{try{process.emitWarning(message,{code:"CANVAS_USAGE_METRICS"})}catch{}};if(onDiagnostic){let reportFailure=()=>warn("Canvas telemetry diagnostic callback failed.");try{Promise.resolve(onDiagnostic(Object.freeze({code}))).catch(reportFailure)}catch{reportFailure()}}else warn(`Canvas telemetry: ${code}.`)}function invalid(){return stats.invalid+=1,diagnose("invalid_event"),!1}async function githubIdentity(signal){if(resolvedGitHubUserId)return resolvedGitHubUserId;try{let value=await getGitHubUserId(signal);if(signal.aborted)return;if(typeof value=="string"&&GITHUB_USER_ID.test(value))return resolvedGitHubUserId=value,value}catch{}diagnose("identity_unavailable")}function schedule(){closing||timer||activeFlush||!queue.length||(timer=setTimeout(()=>{timer=void 0,flush()},queue.length>=batchSize?0:flushIntervalMs),timer.unref?.())}function enqueue(eventName,fields={}){if(!enabled||closing)return!1;try{let eventId=randomId();if(typeof eventId!="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId))return invalid();let event=Object.freeze({...skillContract?{schemaVersion:2,pluginName:skillContract.pluginName,pluginVersion:canvasVersion}:{schemaVersion:1,canvasId,canvasVersion},host,releaseChannel,timestamp:new Date(now()).toISOString(),eventId,eventName,invocationSource:"unknown",...fields}),overflow=queue.length===maxQueueSize;return overflow&&(queue.shift(),stats.dropped+=1),queue.push(event),overflow&&diagnose("queue_overflow"),queue.length>=batchSize&&!activeFlush?flush():schedule(),!0}catch{return stats.dropped+=1,diagnose("event_construction_failed"),!1}}async function deliver(batch){let controller=new AbortController;activeController=controller;let stop=()=>controller.abort(shutdown.signal.reason),deadline=setTimeout(()=>controller.abort("delivery_timeout"),requestTimeoutMs);deadline.unref?.(),shutdown.signal.addEventListener("abort",stop,{once:!0}),shutdown.signal.aborted&&stop();let onAbort,aborted=new Promise(resolve=>{onAbort=()=>resolve(controller.signal.reason),controller.signal.addEventListener("abort",onAbort,{once:!0}),controller.signal.aborted&&onAbort()}),request=Promise.resolve().then(async()=>{if(controller.signal.aborted)return controller.signal.reason;if(transport){await transport(Object.freeze(batch),{signal:controller.signal});return}let headers={"Content-Type":"application/json"};if(getAccessToken){let credential2=await getAccessToken(audience,controller.signal);if(controller.signal.aborted)return controller.signal.reason;let token=typeof credential2=="string"?credential2:credential2?.accessToken;if(typeof token!="string"||!token.trim()||/[\r\n]/.test(token))return"delivery_failed";headers.Authorization=`Bearer ${token}`}let githubUserId=getGitHubUserId?await githubIdentity(controller.signal):void 0;if(getGitHubUserId&&controller.signal.aborted)return controller.signal.reason;let response=await fetchImpl(url,{method:"POST",headers,body:JSON.stringify({schemaVersion:USAGE_ENVELOPE_SCHEMA_VERSION,...githubUserId?{githubUserId}:{},events:batch}),signal:controller.signal,redirect:"error",credentials:"omit"}),accepted=response?.ok;return await response?.body?.cancel(),accepted?void 0:"delivery_rejected"}).catch(()=>"delivery_failed");try{let failure=await Promise.race([request,aborted]);return failure&&diagnose(failure),{delivered:failure?0:batch.length,dropped:failure?batch.length:0}}finally{clearTimeout(deadline),shutdown.signal.removeEventListener("abort",stop),controller.signal.removeEventListener("abort",onAbort),activeController===controller&&(activeController=void 0)}}function flush(){if(activeFlush)return activeFlush;if(clearTimeout(timer),timer=void 0,!queue.length)return Promise.resolve({delivered:0,dropped:0});let batch=queue.splice(0,batchSize);return inFlight=batch.length,activeFlush=deliver(batch).then(result=>(stats.delivered+=result.delivered,stats.dropped+=result.dropped,result)).finally(()=>{inFlight=0,activeFlush=void 0,schedule()}),activeFlush}function feature(actionName,invocationSource){let usage2=actions.get(actionName);return!usage2||!SOURCES.has(invocationSource)?invalid():usage2.usageClass==="excluded"?!1:{...usage2,actionName,invocationSource}}function cancelPending(){activeController?.abort("delivery_cancelled")}function close({flush:drain=!0}={}){return drain||(closing=!0,stats.dropped+=queue.length,queue.length=0,shutdown.abort("delivery_cancelled"),cancelPending()),closePromise||(closing=!0,clearTimeout(timer),timer=void 0,closePromise=(async()=>{let deadline=setTimeout(()=>shutdown.abort("shutdown_timeout"),closeTimeoutMs);deadline.unref?.();try{for(;(queue.length||activeFlush)&&!shutdown.signal.aborted;)await flush();return activeFlush&&await activeFlush,stats.dropped+=queue.length,queue.length=0,{delivered:stats.delivered,dropped:stats.dropped}}finally{clearTimeout(deadline)}})(),closePromise)}let lifecycle={get enabled(){return enabled&&!closing},getStats:()=>Object.freeze({...stats,queued:queue.length,inFlight,closed:closing}),flush,close,cancelPending};if(skillContract){let skills=new Set(skillContract.skills),workflowId=value=>value===""||typeof value=="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);return Object.freeze({...lifecycle,get enabled(){return enabled&&!closing},trackSkillInvoked({skillName,skillTrigger,workflowId:id=""}={}){return!enabled||closing?!1:!skills.has(skillName)||!["user-invoked","agent-invoked","context-load","file-read","unknown"].includes(skillTrigger)||!workflowId(id)?invalid():enqueue("skill_invoked",{skillName,skillTrigger,workflowId:id,invocationSource:"system"})},trackWorkflowCompleted(actionName,{workflowId:id,skillNames,outcome,durationMs}={}){if(!enabled||closing)return!1;let fields=feature(actionName,"system");return fields?!workflowId(id)||!id||!Array.isArray(skillNames)||skillNames.length>skills.size||skillNames.some(name=>!skills.has(name))||new Set(skillNames).size!==skillNames.length||typeof outcome!="string"||!Object.hasOwn(FAILURE_CODES,outcome)||!Number.isFinite(durationMs)?invalid():enqueue("skill_workflow_completed",{...fields,canvasId:skillContract.workflows[actionName].canvasId,workflowId:id,skillNames:Object.freeze([...skillNames].sort()),outcome,durationMs:Math.max(0,Math.min(Math.round(durationMs),36e5)),failureCode:FAILURE_CODES[outcome]}):!1}})}return Object.freeze({...lifecycle,get enabled(){return enabled&&!closing},hasAction:name=>actions.has(name),trackCanvasOpened(invocationSource="unknown"){return!enabled||closing?!1:SOURCES.has(invocationSource)?enqueue("canvas_opened",{invocationSource}):invalid()},trackUiInteraction(input={}){return!enabled||closing?!1:!input||!INTERACTIONS.has(input.interactionType)||!controlRegistry.has(input.controlId)||controlRegistry.get(input.controlId)!==input.controlType?invalid():enqueue("ui_interaction",{invocationSource:"panel",interactionType:input.interactionType,controlId:input.controlId,controlType:input.controlType})},trackFeatureInvoked(actionName,invocationSource="unknown"){if(!enabled||closing)return!1;let fields=feature(actionName,invocationSource);return fields?enqueue("feature_invoked",fields):!1},trackFeatureCompleted(actionName,{outcome,durationMs,invocationSource="unknown",failureCode}={}){if(!enabled||closing)return!1;let fields=feature(actionName,invocationSource);return fields?typeof outcome!="string"||!Object.hasOwn(FAILURE_CODES,outcome)||!Number.isFinite(durationMs)||failureCode!==void 0&&failureCode!==FAILURE_CODES[outcome]?invalid():enqueue("feature_completed",{...fields,outcome,durationMs:Math.max(0,Math.min(Math.round(durationMs),36e5)),failureCode:FAILURE_CODES[outcome]}):!1}})}function createPublicCanvasUsageMetrics(options={}){for(let key of["enabled","endpoint","audience","getAccessToken","transport","now","randomId"])if(Object.hasOwn(options,key))throw new TypeError(`Public canvas telemetry does not accept ${key}.`);return createCanvasUsageMetrics({...options,enabled:!0,endpoint:PUBLIC_CANVAS_USAGE_SERVICE.endpoint,getGitHubUserId:options.getGitHubUserId??resolveGitHubCliUserId})}function capture(callback,fallback){try{let result=callback();return Promise.resolve(result).catch(()=>{}),result}catch{return fallback}}function dataProperty(value,key,inherited=!1){try{for(let depth=0;value!=null&&depth<(inherited?8:1);depth++){let descriptor=Object.getOwnPropertyDescriptor(value,key);if(descriptor)return descriptor.value;value=Object.getPrototypeOf(value)}}catch{}}function completionFromResult(result){return dataProperty(result,"cancelled")===!0||dataProperty(result,"canceled")===!0||dataProperty(result,"status")==="cancelled"?"cancelled":dataProperty(result,"ok")===!1||dataProperty(result,"isError")===!0?"rejected":"succeeded"}function isAbortError(error){if(dataProperty(error,"name",!0)==="AbortError")return!0;try{return Object.getOwnPropertyDescriptor(DOMException.prototype,"name").get.call(error)==="AbortError"}catch{return!1}}function sourceFrom(resolver,args){let source=typeof resolver=="function"?capture(()=>resolver(...args),"unknown"):resolver;return SOURCES.has(source)?source:"unknown"}async function measure(metrics2,name,invocationSource,run,opened,now){let start2=capture(now,0);opened&&capture(()=>metrics2.trackCanvasOpened(invocationSource)),capture(()=>metrics2.trackFeatureInvoked(name,invocationSource));try{let result=await run();return capture(()=>metrics2.trackFeatureCompleted(name,{outcome:completionFromResult(result),invocationSource,durationMs:capture(now,start2)-start2})),result}catch(error){throw capture(()=>metrics2.trackFeatureCompleted(name,{outcome:isAbortError(error)?"cancelled":"failed",invocationSource,durationMs:capture(now,start2)-start2})),error}}function instrumentActionDispatch(dispatch,metrics2,{invocationSource="panel",openedActions=[],now=()=>performance.now()}={}){if(typeof dispatch!="function"||!SOURCES.has(invocationSource)&&typeof invocationSource!="function")throw new TypeError("Invalid dispatch instrumentation.");let opened=new Set(openedActions);return capture(()=>metrics2.enabled,!0)===!1?dispatch:function(name,...args){return capture(()=>metrics2.hasAction(name),!0)?measure(metrics2,name,sourceFrom(invocationSource,[name,...args]),()=>dispatch.call(this,name,...args),opened.has(name),now):dispatch.call(this,name,...args)}}function usage(featureId,featureArea,mutates=!1,usageClass="intentional"){return Object.freeze({featureId,featureArea,usageClass,mutates})}var AZURE_STORAGE_USAGE_CONTRACT=Object.freeze({canvasId:"azure-storage",host:"copilot_app",versions:Object.freeze(["0.3.3"]),actions:Object.freeze({"load-accounts":usage("inventory.accounts","inventory"),"load-subscriptions":usage("inventory.subscriptions","inventory"),"tenant-subscriptions":usage("inventory.tenant_subscriptions","inventory"),"select-subscriptions":usage("inventory.select_subscriptions","inventory"),account:usage("browse.account","browse"),"activate-service":usage("browse.service","browse"),container:usage("browse.container","browse"),"list-shares":usage("browse.shares","browse"),"list-queues":usage("browse.queues","browse"),"list-tables":usage("browse.tables","browse"),"storage-page":usage("browse.page","browse"),"tree-containers":usage("browse.containers","browse"),"open-queue":usage("browse.queue","browse"),"open-table":usage("browse.table","browse"),"open-share":usage("browse.share","browse"),"download-many":usage("blob.download_many","download"),"download-filtered":usage("blob.download_filtered","download"),"share-download":usage("file.download","download"),"sas-download":usage("sas.download","download"),"open-folder":usage("download.open_folder","download"),"upload-many":usage("blob.upload_many","mutation",!0),"container-create":usage("container.create","mutation",!0),"container-delete":usage("container.delete","mutation",!0),"blob-delete":usage("blob.delete","mutation",!0),"queue-create":usage("queue.create","mutation",!0),"queue-delete":usage("queue.delete","mutation",!0),"queue-send":usage("queue.send","mutation",!0),"queue-clear":usage("queue.clear","mutation",!0),"queue-msg-update":usage("queue.update_message","mutation",!0),"queue-msg-delete":usage("queue.delete_message","mutation",!0),"table-create":usage("table.create","mutation",!0),"table-delete":usage("table.delete","mutation",!0),"entity-upsert":usage("table.upsert_entity","mutation",!0),"entity-delete":usage("table.delete_entity","mutation",!0),"share-create":usage("file.create_share","mutation",!0),"share-delete":usage("file.delete_share","mutation",!0),"share-mkdir":usage("file.create_directory","mutation",!0),"share-delete-item":usage("file.delete_item","mutation",!0),"share-upload":usage("file.upload","mutation",!0),"delete-selected":usage("selection.delete","mutation",!0),"cleanup-filtered":usage("blob.cleanup_filtered","mutation",!0),"generate-sas":usage("sas.generate_blob","sas",!0),"generate-container-sas":usage("sas.generate_container","sas",!0),"sas-connect":usage("sas.connect","sas"),filter:usage("blob.filter","analysis"),"transfer-plan":usage("transfer.plan","transfer"),"azcopy-doctor":usage("transfer.doctor","transfer"),"preview-blob":usage("blob.preview","preview"),insights:usage("analysis.explain_stats","analysis"),"explain-blob":usage("preview.explain","preview"),"open-storage-explorer":usage("browse.open_explorer","browse"),"sign-in":usage("auth.sign_in","auth",!0),"save-prefs":usage("settings.save","settings"),"get-prefs":usage("settings.read","settings",!1,"excluded"),"read-state":usage("state.read","state",!1,"excluded"),"canvas-answer":usage("state.answer","state",!1,"excluded"),"dismiss-batch":usage("state.dismiss_batch","state",!1,"excluded"),"dismiss-preview":usage("state.dismiss_preview","state",!1,"excluded"),"dismiss-insight":usage("state.dismiss_insight","state",!1,"excluded"),"dismiss-error":usage("state.dismiss_error","state",!1,"excluded"),diagnose:usage("legacy.diagnose","legacy",!1,"excluded")}),controls:Object.freeze({})});function diagnostic({code}){process.emitWarning(`Canvas telemetry: ${code}.`,{code:"CANVAS_USAGE_METRICS"})}function createStorageMetrics({testMode=process.env.AZURE_STORAGE_TEST_MODE==="1",fetchImpl,getGitHubUserId}={}){let options={contract:AZURE_STORAGE_USAGE_CONTRACT,canvasVersion:BUILD_INFO.version,releaseChannel:"stable"};if(testMode)return createCanvasUsageMetrics({...options,enabled:!1});try{return createPublicCanvasUsageMetrics({...options,fetchImpl,getGitHubUserId,onDiagnostic:diagnostic})}catch{return diagnostic({code:"invalid_configuration"}),createCanvasUsageMetrics({...options,enabled:!1})}}function instrumentStorageRoutes(routes,metrics2){for(let route of Object.keys(routes))if(!Object.hasOwn(AZURE_STORAGE_USAGE_CONTRACT.actions,route.slice(1)))throw new TypeError("Every Storage route requires registered usage metadata.");if(!metrics2)return routes;let dispatch=instrumentActionDispatch(async(name,input,ctx)=>{let result=await routes[`/${name}`](input,ctx);return{result,ok:result?.ok!==!1&&!(Array.isArray(result?.failed)&&result.failed.length),cancelled:result?.cancelled===!0}},metrics2,{invocationSource:(_name,_input,_ctx,source)=>source});return Object.fromEntries(Object.keys(routes).map(route=>[route,async(input,ctx,source="panel")=>(await dispatch(route.slice(1),input,ctx,source)).result]))}var DL_ROOT=path2.join(os2.homedir(),"Downloads","azure-storage");function redactEndpointError(message,endpoints){let msg=String(message).replace(/([?&]sig=)[^&\s"'<>]*/gi,"$1[redacted]");for(let raw of endpoints)try{let url=new URL(raw);msg=msg.replaceAll(raw,`${url.origin}${url.pathname}?[redacted]`);let signature=url.searchParams.get("sig");if(signature)for(let value of[signature,encodeURIComponent(signature)])msg=msg.replaceAll(value,"[redacted]")}catch{}return msg}var PREFS_FILE=path2.join(os2.homedir(),".azure-storage","prefs.json");async function readPrefs(){try{let raw=await fs.readFile(PREFS_FILE,"utf8"),obj=JSON.parse(raw)||{};return{pinned:obj.pinned&&typeof obj.pinned=="object"?obj.pinned:{},hidden:obj.hidden&&typeof obj.hidden=="object"?obj.hidden:{},hiddenTenants:obj.hiddenTenants||{},hiddenSubscriptions:obj.hiddenSubscriptions||{}}}catch{return{pinned:{},hidden:{}}}}async function writePrefs({pinned,hidden,hiddenTenants,hiddenSubscriptions}={}){let safePinned=pinned&&typeof pinned=="object"?pinned:{},safeHidden=hidden&&typeof hidden=="object"?hidden:{};await fs.mkdir(path2.dirname(PREFS_FILE),{recursive:!0});let previous=await readPrefs(),prefs={pinned:safePinned,hidden:safeHidden,hiddenTenants:hiddenTenants||previous.hiddenTenants||{},hiddenSubscriptions:hiddenSubscriptions||previous.hiddenSubscriptions||{}};return await fs.writeFile(PREFS_FILE,JSON.stringify(prefs)),prefs}async function saveDownload(container,name,buffer){let root=path2.resolve(DL_ROOT),full=path2.resolve(root,String(container||""),String(name||"").replace(/[\\/]+/g,path2.sep));if(full!==root&&!full.startsWith(root+path2.sep))throw new Error(`refusing to write outside the download folder: ${container}/${name}`);return await fs.mkdir(path2.dirname(full),{recursive:!0}),await fs.writeFile(full,buffer),full}async function openFolder(dir){let target=path2.resolve(dir||DL_ROOT),isDir=!1;try{isDir=(await fs.stat(target)).isDirectory()}catch{isDir=!1}if(!isDir){if(dir)return{ok:!1,target,error:"folder not found"};await fs.mkdir(target,{recursive:!0}).catch(()=>{}),isDir=!0}let attempts=process.platform==="win32"?[["explorer.exe",[target]],[process.env.ComSpec||"cmd.exe",["/c","start","",target]]]:process.platform==="darwin"?[["open",[target]]]:[["xdg-open",[target]]];for(let[cmd,args]of attempts)if(await new Promise(resolve=>{try{let child=spawn3(cmd,args,{detached:!0,stdio:"ignore"}),settled=!1;child.on("error",()=>{settled||(settled=!0,resolve(!1))}),child.unref(),setTimeout(()=>{settled||(settled=!0,resolve(!0))},200)}catch{resolve(!1)}}))return{ok:!0,target};return{ok:!1,target,error:"no file manager available"}}async function start({agent:agent2,port,az=azure_exports,listTransferSas=listSasBlobs2,transferDoctor=azcopyDoctor,metrics:metrics2}={}){let subscriptionGeneration=0,navigationGeneration=0,discoveredSubscriptions=new Map,pageKey=t=>JSON.stringify([t.account||"",t.kind,t.resource||"",t.dir||t.prefix||""]),pageRequests=new Map,pageResults=new Map,serviceViews=new Map,viewFields={blob:["s_container","s_blobPrefix","s_blobPrefixes","s_blobs","s_blobsMore","s_stats","s_filtered","s_criteria","s_insight"],file:["s_fileDir","s_files"],queue:["s_messages"],table:["s_entities"]};function saveServiceView(st){st.s_account&&viewFields[st.s_kind]&&serviceViews.set(JSON.stringify([st.s_account,st.s_kind]),{...Object.fromEntries(["s_kind","s_item",...viewFields[st.s_kind]].map(key=>[key,st[key]])),incomplete:!!st.s_loading})}async function loadStoragePage(target,ctx,direction){let{getState,setState,log}=ctx,key=pageKey(target),old=getState().s_pages?.[key],cachedPages=direction?(pageResults.get(key)||[]).slice():[],index=direction==="last"?Math.max(0,cachedPages.length-1):direction==="next"?(old?.index||0)+1:direction==="previous"?(old?.index||0)-1:0;if(direction&&(!old||index<0||direction==="next"&&!old.nextToken&&!cachedPages[index]))return{ok:!1,error:"That page is not available. Refresh the current view."};let tokens=direction?old.tokens.slice():[null];direction==="next"&&!cachedPages[index]&&(tokens[index]=old.nextToken);let generation=target.resource&&target.kind!=="sas"?++navigationGeneration:null,request=(pageRequests.get(key)||0)+1;pageRequests.set(key,request);let sasUrl=target.kind==="sas"?getState().s_sasUrl:null;setState({s_pageLoading:key,s_error:null});let result=cachedPages[index]?{ok:!0,data:cachedPages[index]}:await safe(()=>az.listStoragePage({...target,token:tokens[index],...sasUrl?{sasUrl}:{}}));if(pageRequests.get(key)!==request||sasUrl&&sasUrl!==getState().s_sasUrl||generation!=null&&(generation!==navigationGeneration||target.account!==getState().s_account||target.kind!==getState().s_kind||target.resource!==getState().s_item))return{ok:!1,error:"Resource navigation changed; older page discarded."};if(!result.ok){let message=redactEndpointError(result.error,[sasUrl||""]);return setState({s_pageLoading:null,s_pageProgress:null,...target.resource?{s_loading:!1}:{},s_error:message,s_needsAuth:result.needsAuth}),log(`Read ${target.kind} page failed: ${message}`),{ok:!1,error:message}}let data=result.data;for(let scope of pageResults.keys()){let[account,kind,resource]=JSON.parse(scope);scope!==key&&!direction&&account===target.account&&kind===target.kind&&!!resource==!!target.resource&&pageResults.delete(scope)}cachedPages[index]=data,pageResults.set(key,cachedPages);let columns;target.kind==="table"&&target.resource&&(columns=[...new Set(cachedPages.flatMap(page=>page?.entities?.columns||[]))]);let patch={s_pages:{...getState().s_pages,[key]:{index,tokens,nextToken:data.nextToken||null,cachedPageCount:cachedPages.length,cachedItemCount:cachedPages.reduce((count,page)=>count+(page?.items?.length||page?.entities?.rows.length||0),0)}},s_pageProgress:null,s_pageLoading:getState().s_pageLoading===key?null:getState().s_pageLoading,...target.resource?{s_loading:!1}:{}};if(target.kind==="sas"){let parsed=parseSasUrl(getState().s_sasUrl);patch.s_sasBlobs=parsed.canRead?data.items.map(b=>({...b,url:blobSasUrl(getState().s_sasUrl,b.name)})):data.items,patch.s_sasStats=filterAndStat(data.items,{}).stats}else if(target.resource)if(target.kind==="blob"){let criteria=getState().s_criteria,filtered=criteria?filterAndStat(data.items,criteria):null;Object.assign(patch,{s_blobs:data.items,s_blobPrefixes:data.prefixes||[],s_blobsMore:!!data.nextToken,s_stats:filtered?.stats||null,s_filtered:filtered?filtered.filtered.map(b=>b.name):[]})}else target.kind==="file"?patch.s_files=data.items:target.kind==="table"&&(patch.s_entities={...data.entities,columns});else{let field={blob:"containers",file:"shares",queue:"queues",table:"tables"}[target.kind];setTree(ctx,target.account,{[field]:data.items},{[target.kind]:!1})}return setState(patch),{ok:!0,...target.kind==="sas"?{blobs:data.items.length}:target.resource?target.kind==="blob"?{blobs:data.items.length,directories:(data.prefixes||[]).length,truncated:!!data.nextToken}:target.kind==="file"?{items:data.items.length}:{entities:data.entities.rows.length}:{count:data.items.length,...target.kind==="blob"?{containers:data.items.map(item=>item.name)}:{}},page:index+1,hasNext:!!data.nextToken}}async function loadAccounts(_p,{setState,log}){setState({s_loading:!0,s_accountsLoading:!0,s_error:null});let r=await safe(()=>az.listStorageAccounts());return r.ok?(setState({s_loading:!1,s_accountsLoading:!1,s_accounts:r.data}),log(`Loaded ${r.data.length} storage accounts.`),{ok:!0,count:r.data.length}):(setState({s_loading:!1,s_accountsLoading:!1,s_error:r.error,s_needsAuth:r.needsAuth}),log(`Load accounts failed: ${r.error}`),{ok:!1,error:r.error})}async function loadSubscriptions(_p,{setState,log}){setState({s_subsLoading:!0,s_error:null,s_seInstalled:az.storageExplorerInstalled()});let r=await safe(()=>az.listSubscriptions());if(!r.ok)return setState({s_subsLoading:!1,s_error:r.error,s_needsAuth:r.needsAuth}),log(`Load subscriptions failed: ${r.error}`),{ok:!1,error:r.error};let inventory=await safe(()=>az.listTenants()),subs=[...r.data.filter(s=>!discoveredSubscriptions.has(s.tenantId)),...[...discoveredSubscriptions.values()].flat()].sort((a,b)=>(a.displayName||"").localeCompare(b.displayName||"")),tenants=inventory.ok?inventory.data:[];for(let sub of subs)tenants.some(t=>t.tenantId===sub.tenantId)||tenants.push({tenantId:sub.tenantId,displayName:"Cached directory",current:!1});return setState({s_subsLoading:!1,s_subscriptions:subs,s_tenants:tenants,s_tenantInventoryError:inventory.ok?null:inventory.error}),inventory.ok||log(`Current tenant inventory failed: ${inventory.error}`),log(`Found ${tenants.length} directories and ${subs.length} cached subscriptions.`),{ok:!0,count:subs.length}}async function selectSubscriptions({subscriptionIds},{getState,setState,log}){let generation=++subscriptionGeneration,requested=Array.isArray(subscriptionIds)?subscriptionIds:[],chosen=(getState().s_subscriptions||[]).filter(s=>requested.includes(s.subscriptionId)),ids=chosen.map(s=>s.subscriptionId),clearResource={s_account:null,s_container:null,s_kind:null,s_item:null,s_tree:{},s_containers:[],s_blobs:[],s_stats:null,s_filtered:[],s_shares:[],s_queues:[],s_tables:[],s_files:[],s_messages:[],s_entities:null},st=getState(),currentAccount=(st.s_accounts||[]).find(a=>a.name===st.s_account),keepResource=currentAccount&&ids.includes(currentAccount.subscriptionId);if(setState({s_selectedSubs:ids,s_loading:!0,s_accountsLoading:!0,s_error:null,s_needsAuth:!1,s_subscriptionErrors:[],...keepResource?{}:{s_accounts:[],...clearResource}}),!chosen.length)return setState({s_loading:!1,s_accountsLoading:!1}),log("Scope cleared. No subscriptions selected."),{ok:!0,count:0};log(`Loading storage accounts for ${chosen.length} subscription(s)\u2026`);let r=await safe(()=>az.listStorageAccountsForSubs(chosen));if(generation!==subscriptionGeneration)return{ok:!1,error:"Subscription selection changed while accounts were loading. Older results were discarded."};if(!r.ok)return setState({s_loading:!1,s_accountsLoading:!1,s_error:r.error,s_needsAuth:r.needsAuth}),log(`Load accounts failed: ${r.error}`),{ok:!1,error:r.error};let{accounts,errors}=r.data,patch={s_loading:!1,s_accountsLoading:!1,s_accounts:accounts};if(getState().s_account&&!accounts.some(a=>a.name===getState().s_account)&&Object.assign(patch,clearResource),patch.s_subscriptionErrors=errors||[],errors&&errors.length){patch.s_error=`${errors.length} subscription(s) could not be read. ${accounts.length} storage account(s) loaded successfully.`;for(let e of errors)log(`Subscription ${e.subscriptionName} (${e.subscriptionId}, tenant ${e.tenantId||"unknown"}) failed: ${e.error}`)}return setState(patch),log(`Loaded ${accounts.length} accounts from ${chosen.length} subscription(s).`),{ok:!errors.length,count:accounts.length,errors}}function setTree({getState,setState},account,patch,loadingPatch){let tree={...getState().s_tree||{}},cur=tree[account]||{containers:null,shares:null,queues:null,tables:null,loading:{}};tree[account]={...cur,...patch||{},loading:{...cur.loading,...loadingPatch||{}}},setState({s_tree:tree})}async function openAccount({account},ctx){++navigationGeneration;let{getState,setState,log}=ctx;if(!account)return{ok:!1,error:"account required"};if(saveServiceView(getState()),setState({s_error:null,s_account:account,s_container:null,s_blobs:[],s_stats:null,s_filtered:[],s_criteria:null,s_insight:null,s_kind:null,s_item:null,s_files:[],s_messages:[],s_entities:null}),getState().s_tree&&getState().s_tree[account]&&getState().s_tree[account].containers!=null)return log(`Focused account ${account}.`),{ok:!0,cached:!0};if(az.listStoragePage)return loadStoragePage({account,kind:"blob"},ctx);setTree(ctx,account,{},{blob:!0}),log(`Opening account ${account}\u2026`);let r=await safe(()=>az.listContainers(account));return r.ok?(setTree(ctx,account,{containers:r.data},{blob:!1}),log(`${account}: ${r.data.length} containers.`),{ok:!0,containers:r.data.map(c=>c.name)}):(setTree(ctx,account,{},{blob:!1}),setState({s_error:r.error,s_needsAuth:r.needsAuth}),log(`Open ${account} failed: ${r.error}`),{ok:!1,error:r.error})}async function openContainer({container,account,prefix=""},ctx){let{getState,setState,log}=ctx,generation=++navigationGeneration;if(account=account||getState().s_account,!account)return{ok:!1,error:"open an account first"};if(!container)return{ok:!1,error:"container required"};if(typeof prefix!="string"||prefix&&!prefix.endsWith("/"))throw new Error("Invalid blob directory prefix.");if(setState({s_loading:!0,s_error:null,s_account:account,s_container:container,s_kind:"blob",s_item:container,s_blobPrefix:prefix,s_blobPrefixes:[],s_blobs:[],s_blobsMore:!1,s_stats:null,s_filtered:[],s_criteria:null,s_insight:null}),az.listStoragePage)return loadStoragePage({account,kind:"blob",resource:container,prefix},ctx);log(`Listing blobs in ${account}/${container}\u2026`);let r=await safe(()=>az.listBlobDirectory(account,container,{prefix}));return generation!==navigationGeneration||getState().s_account!==account||getState().s_kind!=="blob"?{ok:!1,error:"Resource navigation changed; older blob listing discarded."}:r.ok?(setState({s_loading:!1,s_blobs:r.data.blobs,s_blobPrefixes:r.data.prefixes,s_blobsMore:!!r.data.truncated}),log(`${container}/${prefix}: ${r.data.blobs.length} blobs, ${r.data.prefixes.length} directories${r.data.truncated?" (listing capped at "+r.data.limit+" items)":""}.`),{ok:!0,blobs:r.data.blobs.length,directories:r.data.prefixes.length,truncated:r.data.truncated}):(setState({s_loading:!1,s_error:r.error,s_needsAuth:r.needsAuth}),log(`List ${container} failed: ${r.error}`),{ok:!1,error:r.error})}async function listShares2({account}={},ctx){let{getState,log}=ctx;if(account=account||getState().s_account,!account)return{ok:!1,error:"open an account first"};if(az.listStoragePage)return loadStoragePage({account,kind:"file"},ctx);setTree(ctx,account,{},{file:!0});let r=await safe(()=>az.listShares(account));return r.ok?(setTree(ctx,account,{shares:r.data},{file:!1}),log(`${account}: ${r.data.length} file shares.`),{ok:!0,count:r.data.length}):(setTree(ctx,account,{},{file:!1}),ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),log(`List shares failed: ${r.error}`),{ok:!1,error:r.error})}async function listQueues2({account}={},ctx){let{getState,log}=ctx;if(account=account||getState().s_account,!account)return{ok:!1,error:"open an account first"};if(az.listStoragePage)return loadStoragePage({account,kind:"queue"},ctx);setTree(ctx,account,{},{queue:!0});let r=await safe(()=>az.listQueues(account));return r.ok?(setTree(ctx,account,{queues:r.data},{queue:!1}),log(`${account}: ${r.data.length} queues.`),{ok:!0,count:r.data.length}):(setTree(ctx,account,{},{queue:!1}),ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),log(`List queues failed: ${r.error}`),{ok:!1,error:r.error})}async function listTables2({account}={},ctx){let{getState,log}=ctx;if(account=account||getState().s_account,!account)return{ok:!1,error:"open an account first"};if(az.listStoragePage)return loadStoragePage({account,kind:"table"},ctx);setTree(ctx,account,{},{table:!0});let r=await safe(()=>az.listTables(account));return r.ok?(setTree(ctx,account,{tables:r.data},{table:!1}),log(`${account}: ${r.data.length} tables.`),{ok:!0,count:r.data.length}):(setTree(ctx,account,{},{table:!1}),ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),log(`List tables failed: ${r.error}`),{ok:!1,error:r.error})}async function listContainersTree({account}={},ctx){let{getState,log}=ctx;if(account=account||getState().s_account,!account)return{ok:!1,error:"account required"};if(getState().s_tree&&getState().s_tree[account]&&getState().s_tree[account].containers!=null)return{ok:!0,cached:!0};if(az.listStoragePage)return loadStoragePage({account,kind:"blob"},ctx);setTree(ctx,account,{},{blob:!0});let r=await safe(()=>az.listContainers(account));return r.ok?(setTree(ctx,account,{containers:r.data},{blob:!1}),log(`${account}: ${r.data.length} containers (tree).`),{ok:!0,count:r.data.length}):(setTree(ctx,account,{},{blob:!1}),ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),log(`List containers failed: ${r.error}`),{ok:!1,error:r.error})}async function openQueue({queue,account},{getState,setState,log}){let generation=++navigationGeneration;if(account=account||getState().s_account,!account||!queue)return{ok:!1,error:"open an account first"};setState({s_loading:!0,s_error:null,s_account:account,s_kind:"queue",s_item:queue,s_messages:[]}),log(`Peeking messages in ${account} \xB7 queue ${queue}\u2026`);let r=await safe(()=>az.peekQueueMessages(account,queue));return generation!==navigationGeneration||getState().s_account!==account||getState().s_kind!=="queue"||getState().s_item!==queue?{ok:!1,error:"Resource navigation changed; older queue listing discarded."}:r.ok?(setState({s_loading:!1,s_messages:r.data}),log(`${queue}: peeked ${r.data.length} message(s).`),{ok:!0,messages:r.data.length}):(setState({s_loading:!1,s_error:r.error,s_needsAuth:r.needsAuth}),log(`Peek ${queue} failed: ${r.error}`),{ok:!1,error:r.error})}async function openTable({table,account},ctx){let{getState,setState,log}=ctx;if(++navigationGeneration,account=account||getState().s_account,!account||!table)return{ok:!1,error:"open an account first"};if(setState({s_loading:!0,s_error:null,s_account:account,s_kind:"table",s_item:table,s_entities:null}),az.listStoragePage)return loadStoragePage({account,kind:"table",resource:table},ctx);log(`Querying entities in ${account} \xB7 table ${table}\u2026`);let r=await safe(()=>az.queryTableEntities(account,table));return r.ok?(setState({s_loading:!1,s_entities:r.data}),log(`${table}: ${r.data.rows.length} entities.`),{ok:!0,entities:r.data.rows.length}):(setState({s_loading:!1,s_error:r.error,s_needsAuth:r.needsAuth}),log(`Query ${table} failed: ${r.error}`),{ok:!1,error:r.error})}async function openShare({share,account,dir=""},ctx){let{getState,setState,log}=ctx,generation=++navigationGeneration;if(account=account||getState().s_account,!account||!share)return{ok:!1,error:"open an account first"};if(dir=shareDirectory(dir),setState({s_loading:!0,s_error:null,s_account:account,s_kind:"file",s_item:share,s_fileDir:dir,s_files:[]}),az.listStoragePage)return loadStoragePage({account,kind:"file",resource:share,dir},ctx);log(`Listing files in ${account} \xB7 share ${share}\u2026`);let r=await safe(()=>az.listShareItems(account,share,dir));return generation!==navigationGeneration||getState().s_account!==account||getState().s_kind!=="file"?{ok:!1,error:"Resource navigation changed; older file listing discarded."}:r.ok?(setState({s_loading:!1,s_files:r.data}),log(`${share}: ${r.data.length} item(s).`),{ok:!0,items:r.data.length}):(setState({s_loading:!1,s_error:r.error,s_needsAuth:r.needsAuth}),log(`List ${share} failed: ${r.error}`),{ok:!1,error:r.error})}async function refreshCategory(account,kind,ctx){if(az.listStoragePage)return loadStoragePage({account,kind},ctx);kind==="blob"?setTree(ctx,account,{containers:await az.listContainers(account)}):kind==="queue"?setTree(ctx,account,{queues:await az.listQueues(account)}):kind==="table"?setTree(ctx,account,{tables:await az.listTables(account)}):kind==="file"&&setTree(ctx,account,{shares:await az.listShares(account)})}async function afterMutation(read,ctx){let result=await safe(read);if(result.ok&&result.data?.ok!==!1)return{ok:!0};let cause=result.ok?result.data.error:result.error,error="Operation completed, but the listing could not be refreshed. Refresh it before retrying any operation.";return ctx.setState({s_error:error}),ctx.log(`Post-operation refresh failed: ${cause}`),{ok:!1,error,operationCompleted:!0}}function mutate(fn,{refresh,reopen}={}){return async(payload,ctx)=>{let account=payload&&payload.account||ctx.getState().s_account;if(!account)return{ok:!1,error:"open an account first"};let r=await safe(()=>fn(account,payload,ctx));if(!r.ok)return ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),ctx.log(`Operation failed: ${r.error}`),{ok:!1,error:r.error};if(refresh){let result=await afterMutation(()=>refreshCategory(account,refresh,ctx),ctx);if(!result.ok)return result}if(reopen){let result=await afterMutation(()=>reopen(account,payload,ctx),ctx);if(result?.ok===!1)return result}return r.data??{ok:!0}}}let reopenQueue=(account,{queue},ctx)=>openQueue({account,queue},ctx),reopenTable=(account,{table},ctx)=>openTable({account,table},ctx),reopenShare=(account,{share,dir=""},ctx)=>{let st=ctx.getState();return st.s_account!==account||st.s_kind!=="file"||st.s_item!==share||(st.s_fileDir||"")!==dir?{ok:!0}:openShare({share,account,dir},ctx)};function shareDirectory(dir){if(typeof dir!="string"||dir.split("/").some(p=>p==="."||p==="..")||dir.includes("\\"))throw new Error("Invalid file-share directory path.");return dir.split("/").filter(Boolean).join("/")}async function runBatchDownload(names,{getState,setState,log}){let st=getState(),account=st.s_account,container=st.s_container;if(!account||!container)return{ok:!1,error:"open a container first"};let list=(names||[]).filter(Boolean);if(!list.length)return{ok:!1,error:"no blobs given"};let dir=path2.join(DL_ROOT,container),done=0,okc=0,failed=[];setState({s_batch:{op:"download",total:list.length,done,ok:okc,failed:[],running:!0,dir}}),log(`Downloading ${list.length} blob(s) from ${container}\u2026`);for(let name of list){let r=await safe(()=>az.downloadBlob(account,container,name));if(done++,r.ok)try{await saveDownload(container,name,r.data),okc++}catch(e){failed.push({name,error:"could not save to disk: "+(e&&e.message?e.message:String(e))})}else failed.push({name,error:r.error});setState({s_batch:{op:"download",total:list.length,done,ok:okc,failed:[...failed],running:done<list.length,dir}})}return log(`Download complete: ${okc} ok, ${failed.length} failed. Saved under ${dir}`),{ok:!0,downloaded:okc,failed,dir}}async function runBatchUpload(items,ctx){let{getState,setState,log}=ctx,st=getState(),account=st.s_account,container=st.s_container;if(!account||!container)return{ok:!1,error:"open a container first"};let list=(items||[]).filter(i=>i&&i.name&&i.contentBase64);if(!list.length)return{ok:!1,error:"no items given"};let done=0,okc=0,failed=[];setState({s_batch:{op:"upload",total:list.length,done,ok:okc,failed:[],running:!0}}),log(`Uploading ${list.length} file(s) to ${container}\u2026`);for(let it of list){let buf=Buffer.from(it.contentBase64,"base64"),r=await safe(()=>az.uploadBlob(account,container,(st.s_blobPrefix||"")+it.name,buf,it.contentType));done++,r.ok?okc++:failed.push({name:it.name,error:r.error}),setState({s_batch:{op:"upload",total:list.length,done,ok:okc,failed:[...failed],running:done<list.length}})}let current=getState(),refreshed=current.s_account===account&&current.s_container===container&&current.s_kind==="blob"&&current.s_blobPrefix===st.s_blobPrefix?await afterMutation(()=>openContainer({account,container,prefix:st.s_blobPrefix||""},ctx),ctx):{ok:!0};return log(`Upload complete: ${okc} ok, ${failed.length} failed.`),{ok:refreshed.ok&&!failed.length,uploaded:okc,failed,...refreshed.ok?{}:{error:"Upload finished, but listing refresh failed.",operationCompleted:okc>0}}}async function runBatchCleanup(action,ctx){let{getState,setState,log}=ctx,st=getState(),account=st.s_account,container=st.s_container;if(!account||!container)return{ok:!1,error:"open a container first"};let list=(st.s_filtered||[]).filter(Boolean);if(!list.length)return{ok:!1,error:"filter some blobs first, nothing matched"};let op=action==="delete"?"delete":"archive",done=0,okc=0,failed=[];setState({s_batch:{op,total:list.length,done,ok:okc,failed:[],running:!0}}),log(`${op==="delete"?"Deleting":"Archiving"} ${list.length} matched blob(s) in ${container}\u2026`);for(let name of list){let r=op==="delete"?await safe(()=>az.deleteBlob(account,container,name)):await safe(()=>az.setBlobTier(account,container,name,"Archive"));done++,r.ok?okc++:failed.push({name,error:r.error}),setState({s_batch:{op,total:list.length,done,ok:okc,failed:[...failed],running:done<list.length}})}let current=getState(),refreshed=current.s_account===account&&current.s_container===container&&current.s_kind==="blob"&&current.s_blobPrefix===st.s_blobPrefix?await afterMutation(()=>openContainer({account,container,prefix:st.s_blobPrefix||""},ctx),ctx):{ok:!0};return log(`${op==="delete"?"Delete":"Archive"} complete: ${okc} ok, ${failed.length} failed.`),{ok:refreshed.ok&&!failed.length,op,cleaned:okc,failed,...refreshed.ok?{}:{error:"Cleanup finished, but listing refresh failed.",operationCompleted:okc>0}}}let routes={"/load-accounts":loadAccounts,"/load-subscriptions":loadSubscriptions,"/tenant-subscriptions":async({tenantId},ctx)=>{if(!(ctx.getState().s_tenants||[]).some(t=>t.tenantId===tenantId))throw new Error("Tenant is not in the discovered inventory.");ctx.setState({s_tenantLoading:tenantId});try{let subscriptions=await az.listTenantSubscriptions(tenantId);return discoveredSubscriptions.set(tenantId,subscriptions),ctx.setState({s_subscriptions:[...(ctx.getState().s_subscriptions||[]).filter(s=>s.tenantId!==tenantId),...subscriptions],s_tenantErrors:{...ctx.getState().s_tenantErrors||{},[tenantId]:null}}),ctx.log(`Refreshed ${subscriptions.length} subscriptions for tenant ${tenantId}.`),{ok:!0}}catch(error){let failure=az.discoveryFailure(error);return ctx.setState({s_tenantErrors:{...ctx.getState().s_tenantErrors||{},[tenantId]:failure}}),ctx.log(`Tenant subscription discovery failed: ${failure.error}`),{ok:!1,error:failure.message}}finally{ctx.setState({s_tenantLoading:null})}},"/select-subscriptions":selectSubscriptions,"/account":openAccount,"/activate-service":async({account,kind},ctx)=>{let st=ctx.getState();if(account!==st.s_account||!["blob","file","queue","table"].includes(kind))throw new Error("Service selection changed.");saveServiceView(st),++navigationGeneration;let saved=serviceViews.get(JSON.stringify([account,kind])),{incomplete,...cached}=saved||{};return ctx.setState({s_entities:null,s_blobs:[],s_blobPrefixes:[],s_files:[],s_messages:[],s_stats:null,s_filtered:[],s_criteria:null,s_container:null,...saved?cached:{s_kind:kind,s_item:null},s_loading:!1,s_error:null,s_pageLoading:null,s_pageProgress:null}),incomplete&&cached.s_item?kind==="blob"?openContainer({account,container:cached.s_item,prefix:cached.s_blobPrefix||""},ctx):kind==="file"?openShare({account,share:cached.s_item,dir:cached.s_fileDir||""},ctx):kind==="table"?openTable({account,table:cached.s_item},ctx):openQueue({account,queue:cached.s_item},ctx):{ok:!0,cached:!!saved}},"/container":openContainer,"/list-shares":listShares2,"/list-queues":listQueues2,"/list-tables":listTables2,"/storage-page":async({account,kind,resource,prefix="",dir="",direction},ctx)=>{let st=ctx.getState();if(!["first","last","next","previous","refresh","cancel"].includes(direction))throw new Error("Invalid page direction.");if(kind==="sas"){if(!st.s_sasInfo||account!==st.s_sasInfo.account||resource!==st.s_sasInfo.container)throw new Error("SAS connection changed; refresh its page.")}else if(account!==st.s_account||resource&&(kind!==st.s_kind||resource!==st.s_item||kind==="blob"&&prefix!==(st.s_blobPrefix||"")||kind==="file"&&dir!==(st.s_fileDir||"")))throw new Error("Resource navigation changed; page request discarded.");if(direction==="cancel"){let key=pageKey({account,kind,resource,prefix,dir});return pageRequests.set(key,(pageRequests.get(key)||0)+1),ctx.setState({s_pageLoading:null,s_pageProgress:null,...resource&&kind!=="sas"?{s_loading:!1}:{}}),{ok:!0,cancelled:!0}}return loadStoragePage({account,kind,resource,prefix,dir},ctx,direction==="refresh"?void 0:direction)},"/tree-containers":listContainersTree,"/open-queue":openQueue,"/open-table":openTable,"/open-share":openShare,"/download-many":({blobs},ctx)=>runBatchDownload(blobs,ctx),"/open-folder":async({dir},_ctx)=>await openFolder(dir),"/dismiss-batch":(_p,{setState})=>(setState({s_batch:null}),{ok:!0}),"/get-prefs":async()=>({ok:!0,prefs:await readPrefs()}),"/save-prefs":async(input={})=>({ok:!0,prefs:await writePrefs(input)}),"/upload-many":({items,account,container,prefix},ctx)=>{let st=ctx.getState();if(account!==void 0&&(account!==st.s_account||container!==st.s_container||prefix!==(st.s_blobPrefix||""))){let error="The upload destination changed. Choose files again in the intended directory.";return ctx.setState({s_error:error}),ctx.log(error),{ok:!1,error}}return runBatchUpload(items,ctx)},"/container-create":mutate((a,{container})=>az.createContainer(a,container),{refresh:"blob"}),"/container-delete":async({container,account},ctx)=>{let a=account||ctx.getState().s_account,r=await safe(()=>az.deleteContainer(a,container));if(!r.ok)return ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),{ok:!1,error:r.error};let refreshed=await afterMutation(()=>refreshCategory(a,"blob",ctx),ctx);return ctx.getState().s_kind==="blob"&&ctx.getState().s_item===container&&ctx.setState({s_kind:null,s_item:null,s_container:null,s_blobs:[]}),ctx.log(`Deleted container ${container}.`),refreshed},"/blob-delete":async({container,name,account},ctx)=>{let a=account||ctx.getState().s_account,r=await safe(()=>az.deleteBlob(a,container,name));return r.ok?(await afterMutation(()=>openContainer({account:a,container,prefix:ctx.getState().s_blobPrefix||""},ctx),ctx)).ok?(ctx.log(`Deleted blob ${name}.`),{ok:!0}):{ok:!1,operationCompleted:!0,error:"Blob deleted, but listing refresh failed."}:(ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),{ok:!1,error:r.error})},"/generate-sas":async({container,name,account,minutes,permissions},{getState,log})=>{let a=account||getState().s_account,c=container||getState().s_container;if(!c||!name)return{ok:!1,error:"no blob selected"};let r=await safe(()=>az.generateBlobSas(a,c,name,{minutes:Number(minutes)||60,permissions:permissions||"r"}));return r.ok?(log(`Generated ${r.data.mode} SAS for ${name} (${r.data.permissions}, expires ${r.data.expiresOn}).`),{ok:!0,name,...r.data}):{ok:!1,error:r.error,needsAuth:r.needsAuth}},"/generate-container-sas":async({container,account,minutes,permissions},{getState,log})=>{let a=account||getState().s_account,c=container||getState().s_container;if(!c)return{ok:!1,error:"no container selected"};let r=await safe(()=>az.generateContainerSas(a,c,{minutes:Number(minutes)||1440,permissions:permissions||"rl"}));return r.ok?(log(`Generated ${r.data.mode} container SAS for ${c} (${r.data.permissions}, expires ${r.data.expiresOn}).`),{ok:!0,container:c,...r.data}):{ok:!1,error:r.error,needsAuth:r.needsAuth}},"/queue-create":mutate((a,{queue})=>az.createQueue(a,queue),{refresh:"queue"}),"/queue-delete":async({queue,account},ctx)=>{let a=account||ctx.getState().s_account,r=await safe(()=>az.deleteQueue(a,queue));if(!r.ok)return ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),{ok:!1,error:r.error};let refreshed=await afterMutation(()=>refreshCategory(a,"queue",ctx),ctx);return ctx.getState().s_kind==="queue"&&ctx.getState().s_item===queue&&ctx.setState({s_kind:null,s_item:null,s_messages:[]}),ctx.log(`Deleted queue ${queue}.`),refreshed},"/queue-send":mutate((a,{queue,text})=>az.sendQueueMessage(a,queue,text),{reopen:reopenQueue}),"/queue-clear":mutate((a,{queue})=>az.clearQueueMessages(a,queue),{reopen:reopenQueue}),"/queue-msg-update":mutate((a,{queue,messageId,text})=>az.updateQueueMessage(a,queue,messageId,text),{reopen:reopenQueue}),"/queue-msg-delete":mutate((a,{queue,messageId})=>az.deleteQueueMessage(a,queue,messageId),{reopen:reopenQueue}),"/table-create":mutate((a,{table})=>az.createTable(a,table),{refresh:"table"}),"/table-delete":async({table,account},ctx)=>{let a=account||ctx.getState().s_account,r=await safe(()=>az.deleteTable(a,table));if(!r.ok)return ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),{ok:!1,error:r.error};let refreshed=await afterMutation(()=>refreshCategory(a,"table",ctx),ctx);return ctx.getState().s_kind==="table"&&ctx.getState().s_item===table&&ctx.setState({s_kind:null,s_item:null,s_entities:null}),ctx.log(`Deleted table ${table}.`),refreshed},"/entity-upsert":mutate((a,{table,entity})=>az.upsertEntity(a,table,entity),{reopen:reopenTable}),"/entity-delete":mutate((a,{table,partitionKey,rowKey})=>az.deleteEntity(a,table,partitionKey,rowKey),{reopen:reopenTable}),"/share-create":mutate((a,{share})=>az.createShare(a,share),{refresh:"file"}),"/share-delete":async({share,account},ctx)=>{let a=account||ctx.getState().s_account,r=await safe(()=>az.deleteShare(a,share));if(!r.ok)return ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),{ok:!1,error:r.error};let refreshed=await afterMutation(()=>refreshCategory(a,"file",ctx),ctx);return ctx.getState().s_kind==="file"&&ctx.getState().s_item===share&&ctx.setState({s_kind:null,s_item:null,s_files:[]}),ctx.log(`Deleted file share ${share}.`),refreshed},"/share-mkdir":mutate((a,{share,dir="",name})=>az.createShareDirectory(a,share,shareDirectory(name?[dir,name].filter(Boolean).join("/"):dir)),{reopen:reopenShare}),"/share-delete-item":mutate((a,{share,name,kind,dir=""})=>az.deleteShareItem(a,share,name,kind,shareDirectory(dir)),{reopen:reopenShare}),"/share-upload":mutate((a,{share,name,contentBase64,dir=""})=>az.uploadShareFile(a,share,name,Buffer.from(contentBase64||"","base64"),shareDirectory(dir)),{reopen:reopenShare}),"/share-download":async({account,share,name,dir:directory=""},ctx)=>{let a=account||ctx.getState().s_account;directory=shareDirectory(directory);let r=await safe(()=>az.downloadShareFile(a,share,name,directory));if(!r.ok)return ctx.setState({s_error:r.error,s_needsAuth:r.needsAuth}),{ok:!1,error:r.error};let dir=path2.join(DL_ROOT,share);try{await saveDownload(share,[directory,name].filter(Boolean).join("/"),r.data)}catch(e){let msg="could not save to disk: "+(e&&e.message?e.message:String(e));return ctx.setState({s_error:msg}),{ok:!1,error:msg}}return ctx.setState({s_batch:{op:"download",total:1,done:1,ok:1,failed:[],running:!1,dir}}),ctx.log(`Downloaded ${name} from share ${share} to ${dir}.`),{ok:!0,dir}},"/delete-selected":async({account,kind,resource,dir="",prefix="",names},ctx)=>{let st=ctx.getState();dir=shareDirectory(dir);let fail=error=>(ctx.setState({s_error:error}),ctx.log(`Delete selected failed: ${error}`),{ok:!1,error});if(!["blob","file"].includes(kind)||st.s_account!==account||st.s_kind!==kind||st.s_item!==resource||kind==="file"&&(st.s_fileDir||"")!==dir||kind==="blob"&&(st.s_blobPrefix||"")!==prefix)return fail("The open resource changed. Select items again before deleting.");let items=kind==="blob"?st.s_blobs||[]:st.s_files||[];if(!Array.isArray(names)||!names.length||names.some(n=>!items.some(i=>i.name===n)))return fail("Select items from the current listing before deleting.");let failures=[],deleted=0;for(let name of new Set(names)){let item=items.find(i=>i.name===name),result=await safe(()=>kind==="blob"?az.deleteBlob(account,resource,name):az.deleteShareItem(account,resource,name,item.kind,dir));result.ok?deleted++:(failures.push({name,error:result.error}),ctx.log(`Delete ${name} failed: ${result.error}`))}let refreshed=ctx.getState().s_account===account&&ctx.getState().s_kind===kind&&ctx.getState().s_item===resource&&(kind!=="file"||(ctx.getState().s_fileDir||"")===dir)&&(kind!=="blob"||(ctx.getState().s_blobPrefix||"")===prefix)?await(kind==="blob"?openContainer({account,container:resource,prefix},ctx):openShare({account,share:resource,dir},ctx)):{ok:!0};if(ctx.log(`Delete selected: ${deleted} deleted, ${failures.length} failed.`),failures.length||!refreshed.ok){let error=`${deleted} item(s) deleted; ${failures.length} failed.${refreshed.ok?"":" Listing refresh also failed."} Open diagnostics for details.`;return ctx.setState({s_error:error}),{ok:!1,deleted,failures,error,operationCompleted:deleted>0}}return{ok:!0,deleted}},"/diagnose":(_p,_ctx)=>({ok:!1,error:"diagnosis removed"}),"/filter":async(criteria,{getState,setState,log})=>{let st=getState();if(!(st.s_kind==="blob"&&st.s_container))return{ok:!1,error:"Open a container first to filter its blobs."};let blobs=st.s_blobs||[],{filtered,stats}=filterAndStat(blobs,criteria||{});return setState({s_criteria:criteria||{},s_filtered:filtered.map(b=>b.name),s_stats:stats}),log(`Filter matched ${filtered.length} of ${blobs.length} blobs.`),{ok:!0,matched:filtered.length,stats}},"/download-filtered":async(_p,ctx)=>{let names=ctx.getState().s_filtered||[];return runBatchDownload(names,ctx)},"/cleanup-filtered":({action},ctx)=>runBatchCleanup(action,ctx),"/transfer-plan":async({dest,resolution,useFiltered,source:srcContainer,sourceSas},{getState,setState,log})=>{let st=getState(),account=st.s_account,container=String(srcContainer||st.s_container||"").trim(),sourceSasUrl=String(sourceSas||"").trim(),fail=(message,severity="error")=>{let msg=redactEndpointError(message,[sourceSasUrl,String(dest||"")]);return setState({s_transferErr:msg,s_transferSeverity:severity,s_transferProgress:null,s_transfer:null}),log(`Transfer plan ${severity==="warning"?"blocked":"failed"}: ${msg}`),{ok:!1,error:msg,severity}},parsedSource;if(sourceSasUrl){if(parsedSource=parseSasUrl(sourceSasUrl),!parsedSource.ok)return fail(parsedSource.error);if(!parsedSource.container||parsedSource.blobPath||parsedSource.resource!=="c")return fail("Source must be a container SAS URL, not an account or blob SAS.");if(parsedSource.expired)return fail("Source SAS has expired. Provide a current container SAS.");if(!parsedSource.canRead||!parsedSource.canList)return fail("Source SAS needs Read and List permissions to plan and copy the container.");if(useFiltered)return fail("Filtered transfer applies only to the open account/container source, not a SAS source.")}else{if(!account)return fail("Open a storage account first. Pick one in the Explorer.");if(!container)return fail("Choose a source container.")}let isOpen=!sourceSasUrl&&st.s_kind==="blob"&&st.s_item===container;if(useFiltered&&(!isOpen||!st.s_criteria))return fail("Apply filter criteria to the open source container before planning a filtered transfer.");let progress=side=>count=>setState({s_transferProgress:{side,count}});setState({s_transfer:null,s_transferErr:null,s_transferSeverity:null,s_transferProgress:{side:"source",count:0}});let criteria=useFiltered?{...st.s_criteria,now:st.s_criteria.now||new Date().toISOString()}:null,options={complete:!0,onProgress:progress("source"),...criteria?{prefix:st.s_blobPrefix||"",requireTags:!!(criteria.tags&&Object.keys(criteria.tags).length||criteria.tagKeys?.length)}:{}},allBlobs;if(parsedSource){let rs=await safe(()=>listTransferSas(sourceSasUrl,options));if(!rs.ok)return fail(`Couldn't read the source SAS container: ${rs.error}`);allBlobs=rs.data.blobs}else{let rs=await safe(()=>az.listBlobs(account,container,options));if(!rs.ok)return fail(`Couldn't read source container '${container}': ${rs.error}`);allBlobs=rs.data}if(allBlobs.truncated)return fail("Source inventory is incomplete. No transfer plan was generated.");let prefix=st.s_blobPrefix||"",source=criteria?applyBlobFilter(allBlobs.filter(b=>b.name.startsWith(prefix)&&!b.name.slice(prefix.length).includes("/")),criteria):allBlobs,names=criteria?new Set(source.map(b=>b.name)):null,destStr=String(dest||"").trim();if(!destStr)return fail("Enter a destination: 'account/container' (e.g. myaccount/backups) or a container SAS URL.");if(!/[?&]sig=/.test(destStr)&&destStr.replace(/^https?:\/\//,"").split("/").filter(Boolean).length<2)return fail(`Destination must be 'account/container', not just '${destStr}'. Example: ${account}/${destStr||"backups"}, or paste a container SAS URL.`);if(`${account}/${container}`===destStr.replace(/^https?:\/\//,"").replace(".blob.core.windows.net",""))return fail("Source and destination are the same container. Pick a different destination.");let res=["overwrite","skip","if-newer"].includes(resolution)?resolution:"overwrite",destBlobs=[],destUrl="",destSas=!1;setState({s_transferProgress:{side:"destination",count:0}});let r=await safe(async()=>{if(/[?&]sig=/.test(destStr)){let p=parseSasUrl(destStr);if(!p.ok)throw new Error(p.error);if(!p.container||p.blobPath||p.resource!=="c")throw new Error("Destination must be a container SAS URL, not an account or blob SAS.");if(p.expired)throw new Error("Destination SAS has expired.");if(!p.canList)throw new Error("Destination SAS needs List permission to calculate conflicts.");if(!/w/i.test(p.permissions))throw new Error("Destination SAS needs Write permission for the planned copy.");return destUrl=p.containerUrl,destSas=!0,await listTransferSas(destStr,{complete:!0,onProgress:progress("destination")}).then(x=>x.blobs)}let m=destStr.replace(/^https?:\/\//,"").split("/"),dAcct=m[0].split(".")[0],dCont=m[1];if(!dAcct||!dCont)throw new Error("Destination must be 'account/container' or a container SAS URL.");return destUrl=`https://${dAcct}.blob.core.windows.net/${dCont}`,await az.listBlobs(dAcct,dCont,{complete:!0,onProgress:progress("destination")})});if(!r.ok)return fail(`Couldn't read the destination: ${r.error}`);if(destBlobs=r.data,destBlobs.truncated)return fail("Destination inventory is incomplete. No transfer plan was generated.");let sourceUrl=parsedSource?parsedSource.containerUrl:`https://${account}.blob.core.windows.net/${container}`;if(new URL(sourceUrl).origin+new URL(sourceUrl).pathname===new URL(destUrl).origin+new URL(destUrl).pathname)return fail("Source and destination are the same container. Pick a different destination.");if(res==="if-newer"){let byName=new Map(destBlobs.map(b=>[b.name,b]));if(source.some(b=>byName.has(b.name)&&(!Number.isFinite(Date.parse(b.lastModified))||!Number.isFinite(Date.parse(byName.get(b.name).lastModified)))))return fail("Last modified timestamps are missing for conflicting blobs. Choose Overwrite or Skip existing instead of If source newer.")}let plan=planTransfer(source,destBlobs,res),allSource=!names,{command,needsLogin,empty}=azcopyCommand({sourceUrl,destUrl,resolution:res,includeNames:names?plan.toTransfer:null,allSource});if(empty)return fail("Nothing to transfer \u2014 every selected blob already exists at the destination under the current conflict rule.");let azcopy=await transferDoctor(),summary={...plan,toTransfer:plan.toTransfer.slice(0,100),toTransferTruncated:plan.toTransfer.length>100};return setState({s_transferErr:null,s_transferSeverity:null,s_transferProgress:null,s_transfer:{plan:summary,command,needsLogin,azcopy,sourceLabel:parsedSource?`${parsedSource.account}/${parsedSource.container} (SAS)`:`${account}/${container}`,destLabel:destSas?`${plan.destCount} blobs (SAS)`:destStr,source:allSource?"all blobs":`${source.length} filtered blobs`}}),log(`Transfer plan: ${plan.transferCount} to transfer, ${plan.conflictCount} conflicts (${res}).${azcopy.installed?` AzCopy ${azcopy.version||"detected"}.`:" AzCopy not found \u2014 install it to run the command."}`),{ok:!0,plan:summary,...!parsedSource&&!destSas?{command}:{},needsLogin,azcopy}},"/azcopy-doctor":async(_p,_ctx)=>({ok:!0,azcopy:await azcopyDoctor({refresh:!0})}),"/sas-connect":async({url},ctx)=>{let{setState,log}=ctx;setState({s_loading:!0,s_error:null});let parsed=parseSasUrl(url);if(!parsed.ok)return setState({s_loading:!1,s_error:parsed.error}),{ok:!1,error:parsed.error};if(az.listStoragePage){if(parsed.expired||!parsed.canList||!parsed.container)return setState({s_loading:!1,s_error:"Provide an unexpired container SAS with List permission."}),{ok:!1,error:"Provide an unexpired container SAS with List permission."};let{containerUrl,...info}=parsed;return setState({s_sasUrl:url,s_sasInfo:info,s_sasBlobs:[]}),loadStoragePage({account:parsed.account,kind:"sas",resource:parsed.container},ctx)}log(`Connecting to SAS: ${describeSas(parsed)}`);let r=await safe(()=>listSasBlobs2(url));if(!r.ok)return setState({s_loading:!1,s_error:r.error}),log(`SAS connect failed: ${r.error}`),{ok:!1,error:r.error};let{stats}=filterAndStat(r.data.blobs,{}),withUrls=parsed.canRead?r.data.blobs.map(b=>({...b,url:blobSasUrl(url,b.name)})):r.data.blobs;return setState({s_loading:!1,s_sasUrl:url,s_sasInfo:{account:r.data.account,container:r.data.container,permissions:r.data.permissions,expiresOn:r.data.expiresOn,canRead:parsed.canRead,canList:parsed.canList,canWrite:parsed.canWrite,canDelete:parsed.canDelete,expired:parsed.expired,resource:parsed.resource},s_sasBlobs:withUrls,s_sasStats:stats}),log(`SAS connected: ${r.data.blobs.length} blobs in ${r.data.container}.`),{ok:!0,blobs:r.data.blobs.length}},"/sas-download":async({name},{getState,setState,log})=>{let url=getState().s_sasUrl;if(!url)return{ok:!1,error:"connect a SAS first"};let r=await safe(()=>downloadSasBlob2(url,name));if(!r.ok)return setState({s_error:r.error}),{ok:!1,error:r.error};let container=getState().s_sasInfo?.container||"sas",savedPath;try{savedPath=await saveDownload(container,name,Buffer.from(r.data.contentBase64,"base64"))}catch(e){let msg="could not save to disk: "+(e&&e.message?e.message:String(e));return setState({s_error:msg}),log(`SAS download failed: ${msg}`),{ok:!1,name,error:msg}}return log(`Downloaded '${name}' (${r.data.size} bytes) from SAS.`),{ok:!0,name,size:r.data.size,path:savedPath,dir:path2.dirname(savedPath)}},"/read-state":(_p,{getState})=>{let st=getState(),blobPage=st.s_pages?.[pageKey({account:st.s_account,kind:"blob",resource:st.s_container,prefix:st.s_blobPrefix||""})];return{ok:!0,state:{account:st.s_account,container:st.s_container,subscriptions:(st.s_subscriptions||[]).length,selectedSubs:st.s_selectedSubs||[],selectedSubscriptions:(st.s_subscriptions||[]).filter(s=>(st.s_selectedSubs||[]).includes(s.subscriptionId)),tenants:[...new Set((st.s_subscriptions||[]).map(s=>s.tenantId))],tenantInventory:st.s_tenants||[],tenantInventoryError:st.s_tenantInventoryError||null,loading:!!st.s_loading,error:st.s_error||null,subscriptionErrors:st.s_subscriptionErrors||[],accounts:(st.s_accounts||[]).map(a=>a.name),tree:st.s_tree||{},containers:Object.values(st.s_tree||{}).flatMap(t=>(t.containers||[]).map(c=>c.name)),blobs:st.s_blobs||[],blobsTruncated:blobPage?blobPage.index>0||!!blobPage.nextToken:!!st.s_blobs?.truncated,stats:st.s_stats||null,criteria:st.s_kind==="blob"&&st.s_criteria||null,filtered:st.s_filtered||[],batch:st.s_batch||null,listingPages:Object.entries(st.s_pages||{}).map(([scope,page])=>({scope:JSON.parse(scope),page:page.index+1,hasNext:!!page.nextToken})),sasInfo:st.s_sasInfo||null,sasBlobs:(st.s_sasBlobs||[]).map(b=>({name:b.name,size:b.size,lastModified:b.lastModified||null,contentType:b.contentType||null})),transfer:st.s_transfer?(()=>{let{command,sourceUrl,destUrl,...rest}=st.s_transfer;return rest})():null,insight:st.s_insight||null,preview:st.s_preview?{name:st.s_preview.name,isText:st.s_preview.isText,size:st.s_preview.size,truncated:st.s_preview.truncated,lang:st.s_preview.lang,format:st.s_preview.format||null,category:st.s_preview.category||null,magicHex:st.s_preview.magicHex||null,glb:st.s_preview.glb||null,isImage:!!st.s_preview.image,explaining:!!st.s_preview.explaining,explained:!!st.s_preview.explanation,text:st.s_preview.text||null}:null,s_queues:(st.s_queues||[]).map(q=>({name:q.name})),s_tables:(st.s_tables||[]).map(t=>({name:t.name})),s_shares:(st.s_shares||[]).map(x=>({name:x.name})),s_messages:(st.s_messages||[]).map(m=>({messageId:m.messageId||null,messageText:m.messageText})),s_entities:st.s_entities||null,s_files:(st.s_files||[]).map(f=>({name:f.name,kind:f.kind,size:f.size??null,lastModified:f.lastModified||null})),s_kind:st.s_kind||null,s_item:st.s_item||null,s_fileDir:st.s_fileDir||"",s_blobPrefix:st.s_blobPrefix||"",s_blobPrefixes:st.s_blobPrefixes||[]}}},"/canvas-answer":({answer,visual,target,suggestedFilter},{getState,setState})=>{let payload={pending:!1,answer:String(answer||""),visual:visual||null},st=getState(),t=target==="insights"||target==="preview"||target==="ask"?target:null;if(st.s_preview&&st.s_preview.explaining?t="preview":st.s_insight&&st.s_insight.pending?t="insights":t||(t="ask"),t==="insights")setState({s_insight:{...payload,suggestedFilter:suggestedFilter||null}});else if(t==="preview"){let p=st.s_preview||{};setState({s_preview:{...p,explaining:!1,explanation:payload}})}else setState({s_ask:payload});return{ok:!0}},"/insights":async(_p,{getState,setState,log})=>{let st=getState();return st.s_stats?(setState({s_insight:{pending:!0,answer:null,visual:null,suggestedFilter:null}}),log("Asked Copilot to explain the statistics."),await agent2?.requestInsight?.({account:st.s_account,container:st.s_container}),{ok:!0}):{ok:!1,error:"Filter or open a container first so there are statistics to explain."}},"/preview-blob":async({name},{getState,setState,log})=>{let st=getState(),account=st.s_account,container=st.s_container;if(!account||!container||!name)return{ok:!1,error:"Open a container and pick a blob to preview."};setState({s_preview:{name,pending:!0}});let MAX=32*1024,r=await safe(()=>az.downloadBlob(account,container,name,{maxBytes:MAX}));if(!r.ok)return setState({s_preview:{name,pending:!1,error:r.error}}),log(`Preview failed: ${r.error}`),{ok:!1,error:r.error};let slice=r.data.subarray(0,MAX),{isText,text}=sniffText(slice),bin=isText?null:sniffBinaryFormat(slice,name),mime=isText?null:imageMime(name),sz=await safe(()=>az.blobSize(account,container,name)),total=sz.ok?sz.data:slice.length,RENDER_MAX=25*1024*1024,GLB_MAX=50*1024*1024,image=mime&&total<=RENDER_MAX?{mime}:null,glb=null;if(bin&&/GLB/.test(bin.format)&&total<=GLB_MAX){let full=await safe(()=>az.downloadBlob(account,container,name));full.ok&&(glb=parseGlb(full.data))}return setState({s_preview:{name,pending:!1,size:total,truncated:total>MAX,isText,lang:previewLang(name),text:isText?text:null,format:bin?bin.format:null,category:bin?bin.category:null,magicHex:bin?bin.magicHex:null,image,glb,explanation:null}}),log(`Previewed ${name}: ${isText?"text":bin.format}, ${total} bytes.`),{ok:!0,isText,bytes:total}},"/explain-blob":async(_p,{getState,setState})=>{let p=getState().s_preview;return!p||p.pending||p.error?{ok:!1,error:"Preview a blob first."}:!p.isText&&!p.format?{ok:!1,error:"Preview a blob first."}:(setState({s_preview:{...p,explaining:!0,explanation:null}}),await agent2?.requestPreviewExplain?.({name:p.name,isText:!!p.isText,format:p.format||null,category:p.category||null,size:p.size,glb:p.glb||null}),{ok:!0})},"/dismiss-preview":(_p,{setState})=>(setState({s_preview:null}),{ok:!0}),"/dismiss-insight":(_p,{setState})=>(setState({s_insight:null}),{ok:!0}),"/open-storage-explorer":async(_p,{getState,log})=>{let st=getState(),account=st.s_account||null,kind=st.s_kind||null,item=st.s_item||null,where=item?`${account}/${item}`:account||"the app";log(`Opening Azure Storage Explorer \u2192 ${where}\u2026`);let r=await az.openInStorageExplorer({account,kind,item});return r.ok?(log(r.deepLink?`Opened Storage Explorer at ${where}.`:"Opened Storage Explorer."),{ok:!0,deepLink:r.deepLink}):r.notInstalled?(log("Azure Storage Explorer isn't installed. Opening the download page so you can get the free desktop app."),{ok:!1,notInstalled:!0,install:r.install}):(log(`Storage Explorer: ${r.error}`),{ok:!1,error:r.error})},"/dismiss-error":(_p,{setState})=>(setState({s_error:null,s_needsAuth:!1}),{ok:!0}),"/sign-in":async({tenantId}={},ctx)=>{let{setState,log}=ctx;if(tenantId&&![...ctx.getState().s_subscriptions||[],...ctx.getState().s_tenants||[]].some(s=>s.tenantId===tenantId))throw new Error("The requested tenant is not in the discovered Azure inventory.");setState({s_signingIn:!0,s_error:null}),log("Opening az login in your browser\u2026");let r=await az.signIn({tenantId});return r.ok?(setState({s_signingIn:!1,s_needsAuth:!1,s_error:null}),log("Signed in successfully. Loading subscriptions\u2026"),await loadSubscriptions({},ctx),(ctx.getState().s_selectedSubs||[]).length&&await selectSubscriptions({subscriptionIds:ctx.getState().s_selectedSubs},ctx),{ok:!0}):(setState({s_signingIn:!1,s_error:r.error,s_needsAuth:!0}),log(`Sign-in failed: ${r.error}`),{ok:!1,error:r.error})}},initialState={s_subscriptions:[],s_selectedSubs:[],s_subsLoading:!1,s_accounts:[],s_tree:{},s_containers:[],s_blobs:[],s_filtered:[],s_shares:[],s_queues:[],s_tables:[],s_files:[],s_messages:[],s_entities:null,s_kind:null,s_item:null,s_svcLoading:null,s_account:null,s_container:null,s_stats:null,s_batch:null,s_sasInfo:null,s_sasBlobs:[],s_ask:null,s_transfer:null,s_insight:null,s_preview:null,s_transferErr:null,s_loading:!1,s_accountsLoading:!1,s_error:null,activityLog:[],s_signingIn:!1,s_seInstalled:null};async function mediaHandler(pathname,query,{getState}){if(pathname!=="/blob-media")return null;let name=query.get("name"),st=getState(),p=st.s_preview;if(!p||p.name!==name||!p.image)return null;let account=st.s_account,container=st.s_container;if(!account||!container)return null;let r=await safe(()=>az.downloadBlob(account,container,name));return r.ok?{contentType:p.image.mime||imageMime(name)||"application/octet-stream",buffer:r.data}:null}let server2=await createCanvasServer({html:pageHtml,routes:instrumentStorageRoutes(routes,metrics2),media:mediaHandler,initialState,port});if(typeof az.registerAccountContext=="function"){let releaseContext=az.registerAccountContext(()=>({accounts:server2.getState().s_accounts,subscriptions:server2.getState().s_subscriptions})),close=server2.close;server2.close=()=>{releaseContext(),close()}}return server2.loadAccounts=()=>loadAccounts({},{getState:server2.getState,setState:server2.setState,log:server2.log}),server2.loadSubscriptions=()=>loadSubscriptions({},{getState:server2.getState,setState:server2.setState,log:server2.log}),server2}var session,metrics=createStorageMetrics();async function post(server2,route,body){let res=await fetch(`http://127.0.0.1:${server2.port}${route}`,{method:"POST",headers:{"Content-Type":"application/json","X-Storage-Invocation-Source":"model"},body:JSON.stringify(body||{})});try{return await res.json()}catch{return{ok:res.ok}}}var agent={async requestInsight({container}={}){session?.send({prompt:`On the "Azure Storage" canvas, the user clicked "Explain these statistics"${container?` for container "${container}"`:""}.
Call read_canvas_state ONCE and read the "stats" object (count, total/avg/max size, size histogram buckets, byType, byTier, byExt, topLargest) and the "filtered" set. The numbers are ALREADY provided \u2014 do NOT run shell commands or call other tools to compute them.
Then immediately call answer_on_canvas with target:"insights" and a concise, specific interpretation: what stands out about size distribution, access tiers (Hot/Cool/Cold/Archive), file types, and any cost/cleanup/lifecycle opportunity (e.g. large cold data, many tiny files, old blobs). Cite real numbers. Include a visual ({kind:'bar'|'stat'|'table', ...}) when it helps. If an obvious cleanup/selection would help, ALSO pass suggestedFilter = a storage_filter_blobs criteria object (e.g. {olderThanDays:180} or {tiers:["Archive"],minSize:1048576}) so the user can apply it in one click. Do NOT explain in chat \u2014 render on the canvas.`,displayPrompt:"\u{1F9E0} Storage canvas \u2014 explain statistics"})},async requestPreviewExplain({name,isText,format,category,glb}={}){let glbNote=glb&&!glb.truncated?` The GLB's embedded JSON was parsed \u2014 read preview.glb for the REAL counts (meshes:${glb.meshes}, materials:${glb.materials}, textures:${glb.textures}, nodes:${glb.nodes}, animations:${glb.animations}, vertices:${glb.vertices}, triangles:${glb.triangles}${glb.generator?`, generator:"${glb.generator}"`:""}) and CITE these actual numbers instead of speaking generically.`:"",prompt=isText?`On the "Azure Storage" canvas, the user clicked "Ask Copilot to explain" for the previewed blob "${name}".
Call read_canvas_state ONCE and read "preview" ({name, lang, size, truncated, text}). The file content is ALREADY provided in preview.text \u2014 do NOT run any shell commands, do NOT read files from disk, and do NOT call other tools to fetch it. Work only from preview.text.
Then immediately call answer_on_canvas with target:"preview" and a concise explanation: what this file is, its structure/schema (columns/keys/format), what the data represents, and anything notable. If it was truncated, say so. Add a visual ({kind:'table'|'bar'|'stat'}) only if it clarifies the structure. Do NOT explain in chat \u2014 render on the canvas.`:`On the "Azure Storage" canvas, the user clicked "Explain this file" for the BINARY blob "${name}" (no text preview).
Call read_canvas_state ONCE and read "preview" ({name, size, format, category, magicHex, glb}). The format was detected from the leading magic bytes${format?` and is "${format}"${category?` (${category})`:""}`:""}.${glbNote} The bytes are binary \u2014 do NOT run any shell commands, do NOT download or read the file, and do NOT call other tools. Reason only from the fields in preview.
Then immediately call answer_on_canvas with target:"preview" and a concise explanation of THIS FILE: what "${format||"this format"}" is and what it's used for, ${glb&&!glb.truncated?"PLUS the specific model composition using the real preview.glb counts (meshes/materials/textures/vertices/triangles), and a visual ({kind:'table'} listing those counts). ":""}what tooling opens/produces it, and practical Azure Storage tips (right Content-Type, whether it compresses, viewing, lifecycle/tiering). Keep it specific and do NOT claim to have inspected raw geometry beyond the provided counts. Do NOT explain in chat \u2014 render on the canvas.`;session?.send({prompt,displayPrompt:`\u{1F441} Storage canvas \u2014 explain "${String(name).slice(0,60)}"`})}},server=await start({agent,metrics}),canvas=createCanvas({id:"azure-storage",displayName:"Azure Storage",description:"Browse Azure Storage blobs/containers, bulk-transfer with live progress, filter + aggregate statistics, and open SAS links with no login \u2014 all agent-drivable on one live surface.",actions:[{name:"read_canvas_state",description:"Pull the live data shown on the Storage canvas (current account/directory, blob and file metadata, queue message IDs, applied current-page filter criteria and statistics, filtered set, batch progress, SAS info). Use this before answering any question about what's on the canvas.",inputSchema:{type:"object",properties:{keys:{type:"array",items:{type:"string"}}}},handler:async()=>post(server,"/read-state",{})},{name:"answer_on_canvas",description:"Render shared agent notes alongside resource contents. `target` selects the surface: 'ask' (legacy default name for resource annotations, not a chat), 'insights' (statistics), or 'preview' (blob preview). Conversation stays in the session chat. Pass text `answer` and an optional quantitative `visual` ({kind:'bar'|'stat'|'table', ...}). For target='insights', suggestedFilter can offer a one-click storage filter.",inputSchema:{type:"object",properties:{answer:{type:"string"},visual:{type:"object"},target:{type:"string",enum:["ask","insights","preview"]},suggestedFilter:{type:"object"}},required:["answer"]},handler:async({input})=>post(server,"/canvas-answer",{answer:input.answer,visual:input.visual,target:input.target,suggestedFilter:input.suggestedFilter})},{name:"storage_open_account",description:"Open a storage account on the canvas and load its containers live. Pass the account name exactly as shown in the account list (read_canvas_state \u2192 accounts).",inputSchema:{type:"object",properties:{account:{type:"string"}},required:["account"]},handler:async({input})=>post(server,"/account",{account:input.account})},{name:"storage_open_container",description:"Open a blob container directory on the canvas. Optional prefix is an exact virtual-folder prefix ending in '/'; omit for root. Returns immediate blobs with canonical names and directory prefixes. Capped listings explicitly report incompleteness. Requires an open account.",inputSchema:{type:"object",properties:{container:{type:"string"},prefix:{type:"string"}},required:["container"]},handler:async({input})=>post(server,"/container",{container:input.container,prefix:input.prefix||""})},{name:"storage_batch_download",description:"Download several blobs at once from the open container with a LIVE progress bar and per-file pass/fail summary. Pass `blobs` = array of exact blob names (choose them by reading the blob list \u2014 e.g. the largest, or those older than a date). Non-destructive to the cloud.",inputSchema:{type:"object",properties:{blobs:{type:"array",items:{type:"string"}}},required:["blobs"]},handler:async({input})=>post(server,"/download-many",{blobs:input.blobs})},{name:"storage_batch_upload",description:"MUTATION \u2014 upload multiple files into the open container directory with a live progress bar. The current directory prefix is prepended to each supplied name. Only after the user has clearly asked to upload; narrate what you're uploading first. Pass `items` = array of {name, contentBase64, contentType}.",mutates:!0,inputSchema:{type:"object",properties:{items:{type:"array",items:{type:"object"}}},required:["items"]},handler:async({input})=>post(server,"/upload-many",{items:input.items})},{name:"storage_filter_blobs",description:"Filter the displayed blob page in the open container directory and compute LIVE statistics on the canvas (count, total/avg/max size, size histogram, by-type/by-tier/by-extension breakdown, top-10 largest). This does not enumerate other pages or folders. All criteria optional: namePattern (glob), prefix/suffix/contains (substring match on blob name), minSize/maxSize (bytes), olderThanDays/newerThanDays, type (image|video|audio|text/data|document|archive|binary), tiers (Hot|Cool|Cold|Archive \u2014 array or comma list), blobTypes (BlockBlob|PageBlob|AppendBlob), tagKeys (blob-index tag keys that must exist), tags (object of key=value that must all match). The matched NAMES become the filtered set for storage_download_filtered. read_canvas_state returns the applied criteria.",inputSchema:{type:"object",properties:{namePattern:{type:"string"},prefix:{type:"string"},suffix:{type:"string"},contains:{type:"string"},minSize:{type:"number"},maxSize:{type:"number"},olderThanDays:{type:"number"},newerThanDays:{type:"number"},type:{type:"string"},tiers:{type:"array",items:{type:"string"}},blobTypes:{type:"array",items:{type:"string"}},tagKeys:{type:"array",items:{type:"string"}},tags:{type:"object"}}},handler:async({input})=>post(server,"/filter",input)},{name:"storage_download_filtered",description:"Download every blob currently matched by the last storage_filter_blobs, with a live progress bar. Use after filtering, e.g. 'download everything older than 30 days'. Non-destructive to the cloud.",inputSchema:{type:"object",properties:{}},handler:async()=>post(server,"/download-filtered",{})},{name:"storage_open_sas",description:"Open a container SAS URL on the canvas WITHOUT any az login \u2014 parses the SAS, lists its blobs, and shows a read view. Use when the user pastes a 'https://acct.blob.core.windows.net/container?...&sig=...' link. Impossible for the Azure/Storage MCP (they require a full account + RBAC).",inputSchema:{type:"object",properties:{url:{type:"string"}},required:["url"]},handler:async({input})=>post(server,"/sas-connect",{url:input.url})},{name:"storage_download_sas_blob",description:"Download one blob from the currently-connected SAS container. Pass the exact blob `name` from the SAS blob list. Read-only.",inputSchema:{type:"object",properties:{name:{type:"string"}},required:["name"]},handler:async({input})=>post(server,"/sas-download",{name:input.name})},{name:"storage_browse_page",description:"Browse the current Storage list using cached page results and Azure continuation tokens. First/previous/last use fetched pages; last means last cached page, not an automatic Azure inventory walk. Next fetches an uncached page; refresh invalidates this scope and returns to page one; cancel discards an in-flight read after it finishes. Replaces the displayed page, never modifies cloud data. kind is blob, file, queue (queue list only; message peek has no continuation), table or sas. resource is the open container/share/table, omitted for service resource lists. Retain the exact current blob prefix/file dir. Search and selection apply to the displayed page.",inputSchema:{type:"object",properties:{account:{type:"string"},kind:{type:"string",enum:["blob","file","queue","table","sas"]},resource:{type:"string"},prefix:{type:"string"},dir:{type:"string"},direction:{type:"string",enum:["first","last","next","previous","refresh","cancel"]}},required:["account","kind","direction"]},handler:async({input})=>post(server,"/storage-page",input)},{name:"storage_plan_transfer",description:"Preview an AzCopy transfer from the open container or an explicit sourceSas container URL (Read+List permissions) to dest ('account/container' or a container SAS with List+Write permissions). Follows every inventory page independently of the display cap and calculates conflicts; never moves data. useFiltered reapplies Filter & statistics criteria to all direct blobs in the open folder, not descendants or Search items text. Returns counts/bytes and bounded conflict/name samples with an unsigned command; commands containing SAS credentials stay on the canvas, not in the model response.",inputSchema:{type:"object",properties:{dest:{type:"string"},sourceSas:{type:"string"},resolution:{type:"string",enum:["overwrite","skip","if-newer"]},useFiltered:{type:"boolean"}},required:["dest"]},handler:async({input})=>post(server,"/transfer-plan",{dest:input.dest,sourceSas:input.sourceSas,resolution:input.resolution,useFiltered:input.useFiltered})},{name:"storage_preview_blob",description:"Open an inline text PREVIEW of one blob from the open container (first 32 KB). Pass the exact blob `name`. Read-only. Binary blobs are detected and reported as non-text. After previewing, you can read the text via read_canvas_state \u2192 preview.text and explain it via answer_on_canvas target:'preview'.",inputSchema:{type:"object",properties:{name:{type:"string"}},required:["name"]},handler:async({input})=>post(server,"/preview-blob",{name:input.name})},{name:"storage_explain_stats",description:"Trigger the canvas's 'Explain these statistics' insight panel \u2014 reads the live filtered stats and renders an interpretation (via answer_on_canvas target:'insights'). Use when the user asks what the storage stats mean or how to clean up / optimize cost.",inputSchema:{type:"object",properties:{}},handler:async()=>post(server,"/insights",{})},{name:"storage_list_queues",description:"List the Storage queues in the open account on the canvas (read-only). Opens the Queues view and shows each queue with its approximate message count. Requires an account to be open first (storage_open_account).",inputSchema:{type:"object",properties:{account:{type:"string"}}},handler:async({input})=>post(server,"/list-queues",{account:input.account})},{name:"storage_open_queue",description:"Open one Storage queue on the canvas and peek its messages live (read-only \u2014 peeking does not dequeue). Pass the exact queue `name` from storage_list_queues. Requires an account to be open first.",inputSchema:{type:"object",properties:{queue:{type:"string"},account:{type:"string"}},required:["queue"]},handler:async({input})=>post(server,"/open-queue",{queue:input.queue,account:input.account})},{name:"storage_list_tables",description:"List the Storage tables in the open account on the canvas (read-only). Opens the Tables view. Requires an account to be open first (storage_open_account).",inputSchema:{type:"object",properties:{account:{type:"string"}}},handler:async({input})=>post(server,"/list-tables",{account:input.account})},{name:"storage_open_table",description:"Open one Storage table on the canvas and list its entities live (read-only). Pass the exact table `name` from storage_list_tables. Requires an account to be open first.",inputSchema:{type:"object",properties:{table:{type:"string"},account:{type:"string"}},required:["table"]},handler:async({input})=>post(server,"/open-table",{table:input.table,account:input.account})},{name:"storage_list_shares",description:"List the Azure File shares in the open account on the canvas (read-only). Opens the File shares view. Requires an account to be open first (storage_open_account).",inputSchema:{type:"object",properties:{account:{type:"string"}}},handler:async({input})=>post(server,"/list-shares",{account:input.account})},{name:"storage_open_share",description:"Open one Azure File share directory on the canvas and list its files and directories live (read-only). Pass the exact share `name` from storage_list_shares and optional share-relative dir; omit dir for root. Requires an account to be open first.",inputSchema:{type:"object",properties:{share:{type:"string"},account:{type:"string"},dir:{type:"string"}},required:["share"]},handler:async({input})=>post(server,"/open-share",{share:input.share,account:input.account,dir:input.dir||""})},{name:"log_message",description:"Append a message to the canvas activity log visible to the user.",inputSchema:{type:"object",properties:{message:{type:"string"}},required:["message"]},handler:({input})=>(server.log(input.message),{ok:!0})}],open(){return server.loadSubscriptions().catch(()=>{}),metrics.trackCanvasOpened("panel"),{url:`http://127.0.0.1:${server.port}`,title:"Azure Storage",status:"ready"}},async onClose(){server.close?.(),await metrics.close()}});session=await joinSession({canvases:[canvas]});

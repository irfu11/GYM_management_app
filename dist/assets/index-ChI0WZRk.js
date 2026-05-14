(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function i(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=i(e);fetch(e.href,n)}})();const l=[{id:"M001",name:"Vikram Malhotra",phone:"9820012345",age:29,email:"vikram@example.com",plan:"Premium",start:"2026-05-01",dur:"6",pay:"paid"},{id:"M002",name:"Ananya Iyer",phone:"9123456780",age:24,email:"ananya@example.com",plan:"Standard",start:"2026-04-15",dur:"1",pay:"paid"},{id:"M003",name:"Rahul Sharma",phone:"9988776655",age:31,email:"rahul@example.com",plan:"Basic",start:"2026-01-10",dur:"3",pay:"pending"},{id:"M004",name:"Priya Das",phone:"9776655443",age:27,email:"priya@example.com",plan:"Premium",start:"2026-05-10",dur:"12",pay:"paid"},{id:"M005",name:"Siddharth Roy",phone:"9554433221",age:35,email:"sid@example.com",plan:"Standard",start:"2026-05-05",dur:"1",pay:"pending"},{id:"M006",name:"Meera Kapoor",phone:"9443322110",age:22,email:"meera@example.com",plan:"Basic",start:"2026-05-12",dur:"1",pay:"paid"},{id:"M007",name:"Arjun Verma",phone:"9332211009",age:40,email:"arjun@example.com",plan:"Premium",start:"2026-02-01",dur:"3",pay:"paid"}],o={Basic:{price:800,features:["Gym Access","Locker Room"]},Standard:{price:1200,features:["Gym Access","Locker Room","Personal Trainer (1 session/mo)","Group Classes"]},Premium:{price:2e3,features:["Gym Access","Locker Room","Personal Trainer (4 sessions/mo)","Group Classes","Diet Plan","Steam Bath"]}};window.initialMembers=l;window.gymPlans=o;const r={state:{members:[...initialMembers],plans:{...gymPlans},currentView:"dashboard"},init(){document.getElementById("f-start").value=new Date().toISOString().split("T")[0],document.addEventListener("keydown",t=>{t.key==="Enter"&&!document.getElementById("login-screen").classList.contains("hidden")&&this.login()}),this.renderDashboard()},login(){const t=document.getElementById("login-user").value,a=document.getElementById("login-pass").value,i=document.getElementById("login-error");t==="admin"&&a==="gym123"?(document.getElementById("login-screen").classList.add("hidden"),document.getElementById("main-app").classList.remove("hidden"),i.classList.add("hidden"),this.renderDashboard()):i.classList.remove("hidden")},logout(){document.getElementById("login-screen").classList.remove("hidden"),document.getElementById("main-app").classList.add("hidden"),document.getElementById("login-user").value="",document.getElementById("login-pass").value=""},handleNav(t){const a=t.getAttribute("data-view");this.state.currentView=a,document.querySelectorAll(".nav-item").forEach(i=>i.classList.remove("active")),t.classList.add("active"),document.getElementById("current-page-title").innerText=a.charAt(0).toUpperCase()+a.slice(1),this.refreshView()},refreshView(){const t=this.state.currentView;t==="dashboard"&&this.renderDashboard(),t==="members"&&this.renderMembers(),t==="dues"&&this.renderDues(),t==="plans"&&this.renderPlans()},getExpiry(t,a){const i=new Date(t);return i.setMonth(i.getMonth()+parseInt(a)),i},getStatus(t){return this.getExpiry(t.start,t.dur)<new Date?"Expired":t.pay==="pending"?"Pending":"Active"},formatDate(t){return new Date(t).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})},renderDashboard(){const t=document.getElementById("view-container"),a={total:this.state.members.length,active:this.state.members.filter(e=>this.getStatus(e)==="Active").length,expired:this.state.members.filter(e=>this.getStatus(e)==="Expired").length,revenue:this.state.members.reduce((e,n)=>{const d=this.state.plans[n.plan].price*parseInt(n.dur);return e+(n.pay==="pending"||this.getStatus(n)==="Expired"?d:0)},0)},i=[...this.state.members].reverse().slice(0,5),s=this.state.members.filter(e=>this.getStatus(e)!=="Active");t.innerHTML=`
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Members</div>
                    <div class="stat-value display-font" style="color: var(--accent)">${a.total}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active Members</div>
                    <div class="stat-value display-font" style="color: var(--success)">${a.active}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Expired Plans</div>
                    <div class="stat-value display-font" style="color: var(--danger)">${a.expired}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Due This Month</div>
                    <div class="stat-value display-font" style="color: var(--warning)">₹${a.revenue.toLocaleString("en-IN")}</div>
                </div>
            </div>

            <div class="content-section">
                <div class="section-header"><h2 class="display-font">Recent Activity</h2></div>
                <table>
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Expiry</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${i.map(e=>`
                            <tr>
                                <td>${e.name}</td>
                                <td><span class="badge badge-${e.plan.toLowerCase()}">${e.plan}</span></td>
                                <td><span class="badge badge-${this.getStatus(e).toLowerCase()}">${this.getStatus(e)}</span></td>
                                <td>${this.formatDate(this.getExpiry(e.start,e.dur))}</td>
                                <td>₹${(this.state.plans[e.plan].price*e.dur).toLocaleString()}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>

            <div class="content-section">
                <div class="section-header"><h2 class="display-font">Critical Actions Required</h2></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    ${s.length?s.map(e=>`
                        <div class="stat-card" style="border-left: 4px solid var(--danger)">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <div style="font-weight: 700; margin-bottom: 4px;">${e.name}</div>
                                    <div style="font-size: 12px; color: var(--text-dim)">${e.phone}</div>
                                </div>
                                <span class="badge badge-${this.getStatus(e).toLowerCase()}">${this.getStatus(e)}</span>
                            </div>
                            <div style="margin-top: 15px; font-size: 13px; color: var(--text-dim)">
                                Owed: ₹${(this.state.plans[e.plan].price*e.dur).toLocaleString()}
                            </div>
                        </div>
                    `).join(""):'<p style="color: var(--text-dim)">All members are active and paid.</p>'}
                </div>
            </div>
        `},renderMembers(t=""){const a=document.getElementById("view-container"),i=new Date,s=this.state.members.filter(e=>e.name.toLowerCase().includes(t.toLowerCase())||e.phone.includes(t)||e.plan.toLowerCase().includes(t.toLowerCase()));a.innerHTML=`
            <div class="section-header">
                <div style="position: relative; width: 400px;">
                    <i class="ti ti-search" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-dim)"></i>
                    <input type="text" class="input-field" placeholder="Search members..." 
                        style="padding-left: 45px;" oninput="app.renderMembers(this.value)" value="${t}">
                </div>
                <button class="btn-yellow" style="width: auto; padding: 12px 24px;" onclick="app.openModal()">
                    <i class="ti ti-plus"></i> New Member
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Plan</th>
                        <th>Expiry</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${s.map(e=>{const n=this.getExpiry(e.start,e.dur),d=(n-i)/(1e3*60*60*24);return`
                            <tr class="${d<0?"row-expired":d<=7?"row-expiring":""}">
                                <td style="color: var(--text-dim)">${e.id}</td>
                                <td>
                                    <div style="font-weight: 600;">${e.name}</div>
                                    <div style="font-size: 11px; color: var(--text-dim)">${e.phone}</div>
                                </td>
                                <td><span class="badge badge-${e.plan.toLowerCase()}">${e.plan}</span></td>
                                <td>${this.formatDate(n)}</td>
                                <td><span class="badge badge-${this.getStatus(e).toLowerCase()}">${this.getStatus(e)}</span></td>
                                <td>
                                    <button class="btn-yellow" style="width: auto; padding: 6px 12px; font-size: 11px;" onclick="app.openModal('${e.id}')">Edit</button>
                                    <button class="btn-outline" style="padding: 6px 12px; font-size: 11px; color: var(--danger); border-color: rgba(255,62,62,0.2)" onclick="app.deleteMember('${e.id}')">Delete</button>
                                </td>
                            </tr>
                        `}).join("")}
                </tbody>
            </table>
        `},renderDues(){const t=document.getElementById("view-container"),a=this.state.members.filter(s=>s.pay==="pending"||this.getStatus(s)==="Expired"),i=a.reduce((s,e)=>s+this.state.plans[e.plan].price*e.dur,0);t.innerHTML=`
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Pending Collection</div>
                    <div class="stat-value display-font" style="color: var(--warning)">₹${i.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Accounts Overdue</div>
                    <div class="stat-value display-font" style="color: var(--danger)">${a.length}</div>
                </div>
            </div>

            <div class="content-section">
                <div class="section-header"><h2 class="display-font">Collection List</h2></div>
                ${a.length?`
                    <table>
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Reason</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${a.map(s=>`
                                <tr>
                                    <td>
                                        <div style="font-weight: 600;">${s.name}</div>
                                        <div style="font-size: 11px; color: var(--text-dim)">${s.phone}</div>
                                    </td>
                                    <td><span class="badge badge-pending">${s.pay==="pending"?"Unpaid":"Expired"}</span></td>
                                    <td style="font-weight: 700; color: var(--accent)">₹${(this.state.plans[s.plan].price*s.dur).toLocaleString()}</td>
                                    <td><button class="btn-yellow" onclick="app.markPaid('${s.id}')">Mark as Paid</button></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                `:'<div style="background: var(--bg-panel); padding: 40px; text-align: center; color: var(--text-dim)">All dues are cleared!</div>'}
            </div>
        `},renderPlans(){const t=document.getElementById("view-container");t.innerHTML=`
            <div class="plans-grid">
                ${Object.entries(this.state.plans).map(([a,i])=>{const s=this.state.members.filter(e=>e.plan===a).length;return`
                        <div class="plan-card ${a==="Standard"?"popular":""}">
                            ${a==="Standard"?'<div class="popular-badge">POPULAR</div>':""}
                            <div class="plan-name display-font">${a}</div>
                            <div class="plan-price display-font">₹${i.price} <span style="font-size: 14px; font-family: 'DM Sans'; color: var(--text-dim)">/ month</span></div>
                            <ul class="plan-features">
                                ${i.features.map(e=>`<li><i class="ti ti-check"></i> ${e}</li>`).join("")}
                            </ul>
                            <div style="padding-top: 20px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase;">Active Users</div>
                                <div class="display-font" style="font-size: 24px;">${s}</div>
                            </div>
                        </div>
                    `}).join("")}
            </div>
        `},openModal(t=null){const a=document.getElementById("modal-overlay");if(document.getElementById("member-form").reset(),document.getElementById("f-id").value="",document.getElementById("f-start").value=new Date().toISOString().split("T")[0],t){const s=this.state.members.find(e=>e.id===t);document.getElementById("modal-title").innerText="Update Member Details",document.getElementById("f-id").value=s.id,document.getElementById("f-name").value=s.name,document.getElementById("f-phone").value=s.phone,document.getElementById("f-age").value=s.age,document.getElementById("f-email").value=s.email,document.getElementById("f-plan").value=s.plan,document.getElementById("f-start").value=s.start,document.getElementById("f-dur").value=s.dur,document.getElementById("f-pay").value=s.pay}else document.getElementById("modal-title").innerText="Enroll New Member";a.classList.remove("hidden")},closeModal(){document.getElementById("modal-overlay").classList.add("hidden")},saveMember(){const t=document.getElementById("f-id").value,a={name:document.getElementById("f-name").value,phone:document.getElementById("f-phone").value,age:document.getElementById("f-age").value,email:document.getElementById("f-email").value,plan:document.getElementById("f-plan").value,start:document.getElementById("f-start").value,dur:document.getElementById("f-dur").value,pay:document.getElementById("f-pay").value};if(t){const i=this.state.members.findIndex(s=>s.id===t);this.state.members[i]={...this.state.members[i],...a}}else{const i="M"+String(this.state.members.length+1).padStart(3,"0");this.state.members.push({id:i,...a})}this.closeModal(),this.refreshView()},deleteMember(t){confirm("Are you sure you want to delete this member?")&&(this.state.members=this.state.members.filter(a=>a.id!==t),this.refreshView())},markPaid(t){const a=this.state.members.findIndex(i=>i.id===t);this.getStatus(this.state.members[a])==="Expired"&&(this.state.members[a].start=new Date().toISOString().split("T")[0]),this.state.members[a].pay="paid",this.refreshView()}};r.init();window.app=r;

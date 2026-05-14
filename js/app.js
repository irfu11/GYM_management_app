/**
 * IRONPEAK GYM MANAGEMENT - CORE APPLICATION LOGIC
 */

const app = {
    state: {
        members: [...(window.initialMembers || [])],
        plans: {...(window.gymPlans || {})},
        currentView: 'dashboard'
    },

    // --- DATE & STATUS UTILS ---
    getExpiry(start, months) {
        const date = new Date(start);
        date.setMonth(date.getMonth() + parseInt(months));
        return date;
    },

    getStatus(member) {
        const expiry = this.getExpiry(member.start, member.dur);
        const today = new Date();
        if (expiry < today) return 'Expired';
        if (member.pay === 'pending') return 'Pending';
        return 'Active';
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    },

    // --- WHATSAPP MESSAGING ---
    sendWhatsAppMessage(memberId) {
        const member = this.state.members.find(m => m.id === memberId);
        if (!member) return;

        const expiryDate = this.formatDate(this.getExpiry(member.start, member.dur));
        const message = `Hi ${member.name},\nYour gym membership will expire on ${expiryDate}.\nPlease renew to continue enjoying our facilities. 💪\nThank you!`;
        
        // Encode the message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${member.phone}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
    },

    init() {
        // Set default date for new members to today
        const dInput = document.getElementById('f-start');
        if (dInput) dInput.value = new Date().toISOString().split('T')[0];
        
        // Handle login on enter key
        document.addEventListener('keydown', (e) => {
            const loginScreen = document.getElementById('login-screen');
            if (e.key === 'Enter' && loginScreen && !loginScreen.classList.contains('hidden')) {
                this.login();
            }
        });

        // Set profile image
        const pImg = document.getElementById('user-avatar-small');
        if (pImg) pImg.src = 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80';

        // Initial view
        this.renderDashboard();
    },

    // --- AUTHENTICATION ---
    login() {
        const u = document.getElementById('login-user').value;
        const p = document.getElementById('login-pass').value;
        const error = document.getElementById('login-error');

        if (u === 'admin' && p === 'gym123') {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            if (error) error.classList.add('hidden');
            this.renderDashboard();
        } else {
            if (error) {
                error.classList.remove('hidden');
                error.innerText = 'INVALID LOGIN';
            }
        }
    },

    logout() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    },

    // --- NAVIGATION ---
    handleNav(el, forcedView = null) {
        const view = forcedView || el.getAttribute('data-view');
        this.state.currentView = view;
        
        // UI Updates
        document.querySelectorAll('.tab-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === view) item.classList.add('active');
        });
        
        this.refreshView();
    },

    refreshView() {
        const v = this.state.currentView;
        if (v === 'dashboard') this.renderDashboard();
        if (v === 'members') this.renderMembers();
        if (v === 'dues') this.renderDues();
        if (v === 'profile') this.renderProfile();
    },

    search(query) {
        if (this.state.currentView === 'members') {
            this.renderMembers(query);
        } else if (this.state.currentView === 'dashboard') {
            this.renderDashboard(query);
        }
    },

    // --- VIEW RENDERING ---
    renderDashboard(query = '') {
        const container = document.getElementById('view-container');
        
        // Calculate gym owner stats
        const totalMembers = this.state.members.length;
        const activeMembers = this.state.members.filter(m => this.getStatus(m) === 'Active').length;
        const totalRevenue = this.state.members.reduce((acc, m) => acc + (this.state.plans[m.plan].price * parseInt(m.dur)), 0);
        
        const filtered = this.state.members.filter(m => 
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.phone.includes(query) ||
            m.plan.toLowerCase().includes(query.toLowerCase())
        );

        container.innerHTML = `
            <div style="margin-top: 20px; margin-bottom: 30px;">
                <h2 class="display-font" style="font-size: 28px; margin-bottom: 20px; color: var(--accent);">GYM DASHBOARD</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 30px;">
                    <div style="background: var(--bg-panel); padding: 20px; border-radius: 15px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; margin-bottom: 8px;">Total Members</div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--accent);">${totalMembers}</div>
                    </div>
                    <div style="background: var(--bg-panel); padding: 20px; border-radius: 15px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; margin-bottom: 8px;">Active Members</div>
                        <div style="font-size: 32px; font-weight: 700; color: #4ade80;">${activeMembers}</div>
                    </div>
                    <div style="background: var(--bg-panel); padding: 20px; border-radius: 15px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; margin-bottom: 8px;">Total Revenue</div>
                        <div style="font-size: 28px; font-weight: 700; color: #fbbf24;">₹${(totalRevenue/1000).toFixed(1)}k</div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 30px;">
                <h2 class="display-font" style="font-size: 24px; margin-bottom: 4px;">All Members</h2>
                <p style="font-size: 12px; color: var(--text-dim); margin-bottom: 20px;">${filtered.length} member${filtered.length !== 1 ? 's' : ''} found</p>
            </div>

            <div style="background: var(--bg-panel); border-radius: 20px; border: 1px solid var(--border); overflow: hidden;">
                ${filtered.length ? filtered.map(m => `
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border);">
                        <div style="display: flex; align-items: center; flex-grow: 1;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: #222; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent);">
                                ${m.name.charAt(0)}
                            </div>
                            <div style="flex-grow: 1;">
                                <div style="font-weight: 700; font-size: 14px;">${m.name}</div>
                                <div style="font-size: 11px; color: var(--text-dim);">${m.phone} • ${m.plan} • ${this.getStatus(m)}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="badge badge-${this.getStatus(m).toLowerCase()}">${this.getStatus(m)}</span>
                            <button class="btn-outline" style="padding: 8px 10px; font-size: 14px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #25d366; color: white; border: none; cursor: pointer; width: 36px; height: 36px;" title="Send WhatsApp" onclick="app.sendWhatsAppMessage('${m.id}')"><i class="ti ti-brand-whatsapp"></i></button>
                            <button class="btn-outline" style="padding: 8px 12px; font-size: 11px; border-radius: 8px;" onclick="app.openModal('${m.id}')">Edit</button>
                            <button style="padding: 8px 12px; font-size: 11px; border-radius: 8px; background: #dc2626; color: white; border: none; cursor: pointer;" onclick="app.deleteMember('${m.id}')">Delete</button>
                        </div>
                    </div>
                `).join('') : '<div style="padding: 40px; text-align: center; color: var(--text-dim);">No members found</div>'}
            </div>
        `;
    },

    renderMembers(query = '') {
        const container = document.getElementById('view-container');
        const filtered = this.state.members.filter(m => 
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.phone.includes(query)
        );

        container.innerHTML = `
            <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 class="display-font" style="font-size: 24px;">Member Directory</h2>
                <span style="font-size: 12px; color: var(--accent);">${filtered.length} ACTIVE MEMBERS</span>
            </div>

            <div style="background: var(--bg-panel); border-radius: 20px; border: 1px solid var(--border); overflow: hidden;">
                ${filtered.map(m => `
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; flex-grow: 1; cursor: pointer;" onclick="app.openModal('${m.id}')">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: #222; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent);">
                                ${m.name.charAt(0)}
                            </div>
                            <div style="flex-grow: 1;">
                                <div style="font-weight: 700; font-size: 14px;">${m.name}</div>
                                <div style="font-size: 11px; color: var(--text-dim);">${m.plan} • ${this.getStatus(m)}</div>
                            </div>
                        </div>
                        <span class="badge badge-${this.getStatus(m).toLowerCase()}">${this.getStatus(m)}</span>
                        <button class="btn-outline" style="padding: 8px 12px; font-size: 11px; border-radius: 8px; margin: 0 10px; display: flex; align-items: center; gap: 6px; background: #25d366; color: white; border: none; cursor: pointer;" title="Send WhatsApp" onclick="app.sendWhatsAppMessage('${m.id}'); event.stopPropagation();"><i class="ti ti-brand-whatsapp"></i></button>
                        <i class="ti ti-chevron-right" style="margin-left: 15px;"></i>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderDues() {
        const container = document.getElementById('view-container');
        const dueList = this.state.members.filter(m => m.pay === 'pending' || this.getStatus(m) === 'Expired');
        const totalDue = dueList.reduce((acc, m) => acc + (this.state.plans[m.plan].price * m.dur), 0);

        container.innerHTML = `
            <div style="margin-top: 20px; margin-bottom: 30px;">
                <h2 class="display-font" style="font-size: 24px; margin-bottom: 4px;">Payment Collection</h2>
                <div style="display: flex; gap: 12px; margin-top: 15px;">
                    <div style="flex: 1; background: var(--bg-panel); padding: 15px; border-radius: 15px; border: 1px solid var(--border);">
                        <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Total Outstanding</div>
                        <div style="font-size: 20px; font-weight: 700; color: var(--warning); margin-top: 4px;">₹${totalDue.toLocaleString()}</div>
                    </div>
                    <div style="flex: 1; background: var(--bg-panel); padding: 15px; border-radius: 15px; border: 1px solid var(--border);">
                        <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Pending Accounts</div>
                        <div style="font-size: 20px; font-weight: 700; color: var(--danger); margin-top: 4px;">${dueList.length}</div>
                    </div>
                </div>
            </div>

            <div style="background: var(--bg-panel); border-radius: 20px; border: 1px solid var(--border); overflow: hidden;">
                ${dueList.length ? dueList.map(m => `
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex-grow: 1;">
                            <div style="font-weight: 700; font-size: 14px;">${m.name}</div>
                            <div style="font-size: 11px; color: var(--text-dim);">${m.pay === 'pending' ? 'Unpaid Fee' : 'Expired Plan'} • ₹${(this.state.plans[m.plan].price * m.dur).toLocaleString()}</div>
                        </div>
                        <button class="btn-outline" style="padding: 8px 12px; font-size: 11px; border-radius: 8px; display: flex; align-items: center; gap: 6px; background: #25d366; color: white; border: none; cursor: pointer;" title="Send WhatsApp" onclick="app.sendWhatsAppMessage('${m.id}')"><i class="ti ti-brand-whatsapp"></i></button>
                        <button class="btn-cyan" style="width: auto; padding: 8px 16px; font-size: 11px; border-radius: 8px;" onclick="app.markPaid('${m.id}')">COLLECT</button>
                    </div>
                `).join('') : '<div style="padding: 40px; text-align: center; color: var(--text-dim);">All payments are up to date!</div>'}
            </div>
        `;
    },

    renderProfile() {
        const container = document.getElementById('view-container');
        const stats = {
            total: this.state.members.length,
            active: this.state.members.filter(m => this.getStatus(m) === 'Active').length,
            revenue: this.state.members.reduce((acc, m) => acc + (this.state.plans[m.plan].price * parseInt(m.dur)), 0)
        };


        container.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80" alt="Admin">
                </div>
                <div class="profile-name">IronPeak Admin</div>
                <div class="profile-tag">SENIOR GYM MANAGER</div>
                
                <div class="profile-stats">
                    <div class="p-stat">
                        <div class="p-stat-val">${stats.total}</div>
                        <div class="p-stat-lab">Members</div>
                    </div>
                    <div class="p-stat">
                        <div class="p-stat-val">${stats.active}</div>
                        <div class="p-stat-lab">Active</div>
                    </div>
                    <div class="p-stat">
                        <div class="p-stat-val">₹${(stats.revenue/1000).toFixed(1)}k</div>
                        <div class="p-stat-lab">Collections</div>
                    </div>
                </div>
            </div>

            <div class="profile-list">
                <div class="profile-item">
                    <i class="ti ti-user-shield"></i>
                    <span>Management Credentials</span>
                    <i class="ti ti-chevron-right"></i>
                </div>
                <div class="profile-item">
                    <i class="ti ti-chart-dots"></i>
                    <span>Gym Performance Reports</span>
                    <i class="ti ti-chevron-right"></i>
                </div>
                <div class="profile-item" onclick="app.handleNav(null, 'dues')">
                    <i class="ti ti-credit-card"></i>
                    <span>Financial Overview</span>
                    <i class="ti ti-chevron-right"></i>
                </div>
                <div class="profile-item">
                    <i class="ti ti-settings"></i>
                    <span>App Configuration</span>
                    <i class="ti ti-chevron-right"></i>
                </div>
                <div class="profile-item" onclick="app.logout()" style="color: var(--danger);">
                    <i class="ti ti-logout"></i>
                    <span>Sign Out Manager</span>
                    <i class="ti ti-chevron-right"></i>
                </div>
            </div>
        `;
    },

    // --- MODAL LOGIC ---
    openModal(id = null) {
        const modal = document.getElementById('modal-overlay');
        const form = document.getElementById('member-form');
        form.reset();
        document.getElementById('f-id').value = '';
        document.getElementById('f-start').value = new Date().toISOString().split('T')[0];

        if (id) {
            const m = this.state.members.find(x => x.id === id);
            document.getElementById('modal-title').innerText = 'Update Member Details';
            document.getElementById('f-id').value = m.id;
            document.getElementById('f-name').value = m.name;
            document.getElementById('f-phone').value = m.phone;
            document.getElementById('f-age').value = m.age;
            document.getElementById('f-email').value = m.email;
            document.getElementById('f-plan').value = m.plan;
            document.getElementById('f-start').value = m.start;
            document.getElementById('f-dur').value = m.dur;
            document.getElementById('f-pay').value = m.pay;
        } else {
            document.getElementById('modal-title').innerText = 'Enroll New Member';
        }
        
        modal.classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    saveMember() {
        const id = document.getElementById('f-id').value;
        const data = {
            name: document.getElementById('f-name').value,
            phone: document.getElementById('f-phone').value,
            age: document.getElementById('f-age').value,
            email: document.getElementById('f-email').value,
            plan: document.getElementById('f-plan').value,
            start: document.getElementById('f-start').value,
            dur: document.getElementById('f-dur').value,
            pay: document.getElementById('f-pay').value
        };

        if (id) {
            const idx = this.state.members.findIndex(m => m.id === id);
            this.state.members[idx] = { ...this.state.members[idx], ...data };
        } else {
            const newId = 'M' + String(this.state.members.length + 1).padStart(3, '0');
            this.state.members.push({ id: newId, ...data });
        }

        this.closeModal();
        this.refreshView();
    },

    deleteMember(id) {
        if (confirm('Are you sure you want to delete this member?')) {
            this.state.members = this.state.members.filter(m => m.id !== id);
            this.refreshView();
        }
    },

    markPaid(id) {
        const idx = this.state.members.findIndex(m => m.id === id);
        if (this.getStatus(this.state.members[idx]) === 'Expired') {
            this.state.members[idx].start = new Date().toISOString().split('T')[0];
        }
        this.state.members[idx].pay = 'paid';
        this.refreshView();
    }
};

// Expose to global scope for HTML onclick handlers
window.app = app;

// Start App
console.log('IRONPEAK: Initializing app module...');
app.init();
// Flush any queued calls that happened before app.js loaded
if (window.__app_queue && Array.isArray(window.__app_queue)) {
    window.__app_queue.forEach(item => {
        try {
            if (typeof app[item.fn] === 'function') app[item.fn](...item.args);
        } catch (e) {
            console.error('Error flushing queued app call', item.fn, e);
        }
    });
    delete window.__app_queue;
}
console.log('IRONPEAK: App initialized.');

const app = {
    // Current State
    currentUser: null,
    chatInterval: null,
    selectedChatFile: null,
    lastMessagesState: '',
    
    // Initialize App
    async init() {
        await this.checkLoginState();
    },

    // UI Navigation
    navigateTo(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        if (document.getElementById('joinError')) document.getElementById('joinError').classList.add('d-none');
        if (document.getElementById('syndicLoginError')) document.getElementById('syndicLoginError').classList.add('d-none');
        
        if(screenId === 'screen-syndic-dashboard' || screenId === 'screen-resident-dashboard') {
            document.getElementById('floatingChatBtn').classList.remove('d-none');
        } else {
            document.getElementById('floatingChatBtn').classList.add('d-none');
            // Close chat if navigating away from dashboards
            document.getElementById('chatWindow').classList.add('d-none');
            if(this.chatInterval) clearInterval(this.chatInterval);
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if(screenId === 'screen-home' || screenId === 'screen-syndic-setup' || screenId === 'screen-resident-setup') {
            logoutBtn.classList.add('d-none');
        } else {
            logoutBtn.classList.remove('d-none');
            logoutBtn.onclick = () => this.logout();
        }
    },

    async checkLoginState() {
        // Keep checking localStorage for the active session (not the database data)
        const storedUser = localStorage.getItem('syndic_app_user');
        if(storedUser) {
            this.currentUser = JSON.parse(storedUser);
            if(this.currentUser.role === 'syndic') {
                await this.loadSyndicDashboard();
            } else if (this.currentUser.role === 'resident'){
                await this.loadResidentDashboard();
            }
        } else {
            this.navigateTo('screen-home');
        }
    },

    // --- Syndic Methods --- //
    
    switchSyndicAuthTab(tab) {
        const loginTab = document.getElementById('tabSyndicLogin');
        const regTab = document.getElementById('tabSyndicRegister');
        const loginForm = document.getElementById('syndicLoginFormWrapper');
        const regForm = document.getElementById('syndicRegisterFormWrapper');

        document.getElementById('syndicLoginError').classList.add('d-none');

        if(tab === 'login') {
            loginTab.style.borderBottomColor = 'var(--primary)';
            loginTab.style.color = 'var(--text-main)';
            regTab.style.borderBottomColor = 'transparent';
            regTab.style.color = 'var(--text-muted)';
            loginForm.classList.remove('d-none');
            regForm.classList.add('d-none');
        } else {
            regTab.style.borderBottomColor = 'var(--primary)';
            regTab.style.color = 'var(--text-main)';
            loginTab.style.borderBottomColor = 'transparent';
            loginTab.style.color = 'var(--text-muted)';
            regForm.classList.remove('d-none');
            loginForm.classList.add('d-none');
        }
    },

    async loginSyndic(event) {
        event.preventDefault();
        const code = document.getElementById('syndicLoginCode').value.trim().toUpperCase();
        const password = document.getElementById('syndicLoginPassword').value.trim();
        
        try {
            // Fetch building from Supabase checking both code and password
            const { data, error } = await supabaseClient
                .from('buildings')
                .select('*')
                .eq('join_code', code)
                .eq('syndic_password', password)
                .single();
                
            if (error || !data) {
                document.getElementById('syndicLoginError').classList.remove('d-none');
                return;
            }

            this.currentUser = {
                role: 'syndic',
                name: data.syndic_name,
                buildingName: data.building_name,
                joinCode: data.join_code
            };
            
            localStorage.setItem('syndic_app_user', JSON.stringify(this.currentUser));
            this.showNotification('تم تسجيل الدخول بنجاح عبر السحابة!');
            await this.loadSyndicDashboard();
        } catch (err) {
            console.error(err);
            if(err.message && err.message.includes('URL')) alert('تأكد من وضع الرابط والمفتاح في ملف config.js');
            else this.showNotification('حدث خطأ أثناء الاتصال بقاعدة البيانات');
        }
    },

    async registerSyndic(event) {
        event.preventDefault();
        const name = document.getElementById('syndicName').value;
        const building = document.getElementById('buildingName').value;
        const password = document.getElementById('syndicPasswordReg').value;
        const joinCode = this.generateCode(6);
        
        try {
            // Insert into Supabase buildings table with password
            const { error } = await supabaseClient
                .from('buildings')
                .insert([
                    { join_code: joinCode, syndic_name: name, building_name: building, syndic_password: password }
                ]);

            if (error) {
                if(error.message && (error.message.includes('FetchError') || error.message.includes('URL'))) {
                    alert('يرجى وضع رابط ومفتاح Supabase الخاصين بك في ملف config.js لكي تعمل القاعدة.');
                    return;
                }
                throw error;
            }
            
            this.currentUser = {
                role: 'syndic',
                name: name,
                buildingName: building,
                joinCode: joinCode
            };
            
            localStorage.setItem('syndic_app_user', JSON.stringify(this.currentUser));
            this.showNotification('تم تسجيل العمارة في السحابة بنجاح!');
            await this.loadSyndicDashboard();
        } catch(err) {
            console.error(err);
            this.showNotification('حدث خطأ أثناء الاتصال للإنشاء.');
        }
    },

    async loadSyndicDashboard() {
        if(!this.currentUser) return;
        
        // Always navigate first so the user sees the dashboard immediately
        this.navigateTo('screen-syndic-dashboard');
        
        try {
            // Get Residents from Supabase
            const { data: residents, error } = await supabaseClient
                .from('residents')
                .select('*')
                .eq('building_join_code', this.currentUser.joinCode)
                .order('created_at', { ascending: false });

            document.getElementById('dashSyndicName').innerText = this.currentUser.name;
            document.getElementById('dashBuildingName').innerText = this.currentUser.buildingName;
            document.getElementById('buildingCodeDisplay').innerText = this.currentUser.joinCode;
            
            if(!error) {
                document.getElementById('statsApartments').innerText = residents ? residents.length : 0;
                const tbody = document.getElementById('residentsTableBody');
                tbody.innerHTML = '';
                if(!residents || residents.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:var(--text-muted)">لم ينضم أي ملاك بعد. شارك الرمز السري لبدء الإدارة.</td></tr>`;
                } else {
                    residents.forEach(res => {
                        const paidClass = res.has_paid ? 'btn-success' : 'btn-outline';
                        const paidText = res.has_paid ? '<i class="fa-solid fa-check"></i> مدفوع' : 'غير مدفوع';
                        const warnClass = res.has_warning ? 'btn-danger' : 'btn-outline';
                        const warnText = res.has_warning ? '<i class="fa-solid fa-triangle-exclamation"></i> تم الإنذار' : 'توجيه إنذار';
                        tbody.innerHTML += `
                            <tr>
                                <td>${res.name}</td>
                                <td>${res.apt_number}</td>
                                <td>${res.join_date}</td>
                                <td><span class="status-badge">${res.is_manual ? 'مضاف يدوياً' : 'منضم حديثاً'}</span></td>
                                <td>
                                    <button class="btn ${paidClass}" onclick="app.togglePayment('${res.id}', ${!res.has_paid})" style="font-size:0.85rem; padding:0.4rem 0.8rem; width:100px;">
                                        ${paidText}
                                    </button>
                                </td>
                                <td>
                                    <button class="btn ${warnClass}" onclick="app.toggleWarning('${res.id}', ${!res.has_warning})" style="font-size:0.85rem; padding:0.4rem 0.8rem; width:110px;">
                                        ${warnText}
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-outline" style="color:var(--danger); border-color:var(--danger); font-size:0.85rem; padding:0.4rem 0.8rem;" onclick="app.removeResident('${res.id}', '${res.name}')">
                                        <i class="fa-solid fa-trash-can"></i> إزالة
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                }
            }
        } catch(err) {
            console.error('Residents fetch error:', err);
        }

        // Load complaints separately - won't block login if table missing
        try {
            const { data: complaints } = await supabaseClient
                .from('complaints')
                .select('*')
                .eq('building_join_code', this.currentUser.joinCode)
                .order('created_at', { ascending: false });

            const activeComplaints = complaints ? complaints.filter(c => !c.is_resolved) : [];
            const compStats = document.getElementById('statsComplaints');
            if(compStats) compStats.innerText = activeComplaints.length;

            const compArea = document.getElementById('syndicComplaintsArea');
            if(compArea) {
                compArea.innerHTML = '';
                if(!complaints || complaints.length === 0) {
                    compArea.innerHTML = '<div class="text-center" style="color:var(--text-muted); padding:1rem;">لا توجد أي شكاوى حالياً.</div>';
                } else {
                    complaints.forEach(c => {
                        const statusBadge = c.is_resolved ? '<span class="status-badge" style="background:#dcfce7; color:#059669;">معالجة</span>' : '<span class="status-badge" style="background:#fee2e2; color:#dc2626;">قيد الانتظار</span>';
                        const actionBtn = c.is_resolved
                            ? `<button class="btn btn-outline" style="font-size:0.8rem; padding:0.3rem 0.6rem;" onclick="app.deleteComplaint('${c.id}')"><i class="fa-solid fa-trash"></i> مسح</button>`
                            : `<button class="btn btn-success" style="font-size:0.8rem; padding:0.3rem 0.6rem;" onclick="app.resolveComplaint('${c.id}')"><i class="fa-solid fa-check"></i> تحديد كمعالجة</button>`;
                        const dateStr = new Date(c.created_at).toLocaleDateString('ar-MA');
                        compArea.innerHTML += `
                            <div style="background:#fff; border:1px solid var(--border); border-radius:var(--border-radius); padding:1rem; box-shadow:0 2px 4px rgba(0,0,0,0.02); display:flex; flex-direction:column; gap:0.5rem;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <strong style="color:var(--text-main); font-size:1.05rem;">${c.sender_name} (رقم الشقة ${c.apt_number})</strong>
                                    <div>${statusBadge}</div>
                                </div>
                                <div style="color:var(--text-muted); font-size:0.85rem;">تاريخ الشكوى: ${dateStr}</div>
                                <p style="color:var(--text-main); line-height:1.5; margin:0.5rem 0; background:#f8fafc; padding:0.8rem; border-radius:8px;">${c.complaint_text}</p>
                                <div style="display:flex; justify-content:flex-end;">${actionBtn}</div>
                            </div>`;
                    });
                }
            }
        } catch(err) {
            console.error('Complaints fetch skipped (table may not exist yet):', err);
        }
    },

    toggleAddAptForm() {
        const formContainer = document.getElementById('addAptFormContainer');
        formContainer.classList.toggle('d-none');
    },

    async togglePayment(id, status) {
        try {
            const { error } = await supabaseClient
                .from('residents')
                .update({ has_paid: status })
                .eq('id', id);
            
            if (error) throw error;
            this.showNotification(status ? 'تم تحديد الشقة كمدفوعة الواجب.' : 'تم إلغاء الدفع للشقة.');
            await this.loadSyndicDashboard();
        } catch(err) {
            console.error(err);
            alert('تفاصيل خطأ التعديل: ' + (err.message || JSON.stringify(err)));
            this.showNotification('فشل تعديل الواجب الشهري');
        }
    },

    async toggleWarning(id, status) {
        try {
            const { error } = await supabaseClient
                .from('residents')
                .update({ has_warning: status })
                .eq('id', id);
            
            if (error) throw error;
            this.showNotification(status ? 'تم توجيه إنذار للشقة بنجاح.' : 'تم إزالة الإنذار.');
            await this.loadSyndicDashboard();
        } catch(err) {
            console.error(err);
            alert('تفاصيل خطأ التعديل: ' + (err.message || JSON.stringify(err)));
            this.showNotification('فشل تعديل الإنذار');
        }
    },

    async removeResident(id, name) {
        if(confirm(`هل أنت متأكد من إزالة المالك "${name}" وشقته نهائياً من العمارة؟\nلا يمكن التراجع عن هذا الإجراء.`)) {
            try {
                const { error } = await supabaseClient
                    .from('residents')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                this.showNotification('تم إزالة الشقة بنجاح.');
                await this.loadSyndicDashboard();
            } catch(err) {
                console.error(err);
                alert('تفاصيل خطأ الإزالة: ' + (err.message || JSON.stringify(err)));
                this.showNotification('فشل إزالة الشقة');
            }
        }
    },

    async syndicAddResident(event) {
        event.preventDefault();
        const name = document.getElementById('manualAptName').value.trim();
        const aptNumber = document.getElementById('manualAptNum').value.trim();
        const currentDate = new Date().toLocaleDateString('ar-MA');
        
        try {
            // التحقق من أن الشقة غير مسجلة مسبقاً
            const { data: existingApt } = await supabaseClient
                .from('residents')
                .select('*')
                .eq('building_join_code', this.currentUser.joinCode)
                .eq('apt_number', aptNumber);

            if (existingApt && existingApt.length > 0) {
                alert(`عذراً، الشقة رقم ${aptNumber} مسجلة مسبقاً التابعة للاسم "${existingApt[0].name}".`);
                return;
            }

            const { error } = await supabaseClient
                .from('residents')
                .insert([
                    { 
                        building_join_code: this.currentUser.joinCode, 
                        name: name, 
                        apt_number: aptNumber, 
                        join_date: currentDate,
                        is_manual: true
                    }
                ]);

            if (error) throw error;
            
            document.getElementById('manualAptForm').reset();
            this.toggleAddAptForm();
            this.showNotification('تم إضافة الشقة بنجاح إلى قاعدة البيانات!');
            await this.loadSyndicDashboard();
        } catch(err) {
            console.error(err);
            this.showNotification('فشل إضافة الشقة');
        }
    },

    // --- Resident Methods --- //

    async registerResident(event) {
        event.preventDefault();
        const name = document.getElementById('residentName').value.trim();
        const aptNumber = document.getElementById('apartmentNumber').value.trim();
        const joinCode = document.getElementById('joinCode').value.trim().toUpperCase();
        
        try {
            // Check if building exists first in Supabase
            const { data: building, error: bError } = await supabaseClient
                .from('buildings')
                .select('*')
                .eq('join_code', joinCode)
                .single();

            if (bError || !building) {
                document.getElementById('joinError').classList.remove('d-none');
                return;
            }
            
            // التحقق من أن الشقة غير مسجلة مسبقاً
            const { data: existingApt } = await supabaseClient
                .from('residents')
                .select('*')
                .eq('building_join_code', joinCode)
                .eq('apt_number', aptNumber);

            if (existingApt && existingApt.length > 0) {
                if (existingApt[0].name === name) {
                    // نفس الشخص، فقط تسجيل دخول
                    this.currentUser = {
                        role: 'resident',
                        name: name,
                        aptNumber: aptNumber,
                        joinCode: joinCode,
                        buildingName: building.building_name,
                        syndicName: building.syndic_name
                    };
                    localStorage.setItem('syndic_app_user', JSON.stringify(this.currentUser));
                    this.showNotification('مرحباً بك مجدداً! تم تسجيل الدخول بنجاح.');
                    await this.loadResidentDashboard();
                    return;
                } else {
                    alert(`عذراً، الشقة رقم ${aptNumber} مسجلة بالفعل باسم "${existingApt[0].name}".`);
                    return;
                }
            }
            
            const currentDate = new Date().toLocaleDateString('ar-MA');
            
            // Insert Resident to Supabase
            const { error: rError } = await supabaseClient
                .from('residents')
                .insert([
                    { 
                        building_join_code: joinCode, 
                        name: name, 
                        apt_number: aptNumber, 
                        join_date: currentDate,
                        is_manual: false
                    }
                ]);

            if (rError) throw rError;
            
            this.currentUser = {
                role: 'resident',
                name: name,
                aptNumber: aptNumber,
                joinCode: joinCode,
                buildingName: building.building_name,
                syndicName: building.syndic_name
            };
            
            localStorage.setItem('syndic_app_user', JSON.stringify(this.currentUser));
            this.showNotification('تم الانضمام للعمارة بشكل سحابي بنجاح!');
            await this.loadResidentDashboard();

        } catch(err) {
            console.error(err);
            if(err.message && err.message.includes('URL')) alert('ارتباط قاعدة البيانات غير مكتمل في ملف config.js');
            this.showNotification('حدث خطأ أثناء الانضمام للعمارة');
        }
    },

    async loadResidentDashboard() {
        if(this.currentUser) {
            try {
                // Fetch latest data for this resident
                const { data, error } = await supabaseClient
                    .from('residents')
                    .select('*')
                    .eq('building_join_code', this.currentUser.joinCode)
                    .eq('name', this.currentUser.name)
                    .eq('apt_number', this.currentUser.aptNumber);
                
                if(!error && data && data.length > 0) {
                    const residentData = data[0];
                    
                    const payStatusEl = document.getElementById('resPaymentStatus');
                    if(residentData.has_paid) {
                        payStatusEl.innerText = 'مدفوع';
                        payStatusEl.className = 'stat-value text-success';
                    } else {
                        payStatusEl.innerText = 'غير مدفوع';
                        payStatusEl.className = 'stat-value text-danger';
                    }

                    const warnBox = document.getElementById('resWarningBox');
                    if(residentData.has_warning) {
                        warnBox.classList.remove('d-none');
                        warnBox.classList.add('d-flex');
                    } else {
                        warnBox.classList.add('d-none');
                        warnBox.classList.remove('d-flex');
                    }
                }
            } catch(e) { console.error(e); }

            document.getElementById('dashResName').innerText = this.currentUser.name;
            document.getElementById('dashResApt').innerText = this.currentUser.aptNumber;
            document.getElementById('dashResBuildingName').innerText = this.currentUser.buildingName;
            document.getElementById('dashResSyndicName').innerText = this.currentUser.syndicName;
        }
        this.navigateTo('screen-resident-dashboard');
    },

    // --- Chat Methods --- //
    
    toggleChat() {
        const chatWin = document.getElementById('chatWindow');
        chatWin.classList.toggle('d-none');
        if(!chatWin.classList.contains('d-none')) {
            // Force refresh when opened
            this.lastMessagesState = '';
            this.loadMessages();
            // Polling interval expanded to 7s instead of 3s to relieve network congestion
            this.chatInterval = setInterval(() => this.loadMessages(), 7000);
            setTimeout(() => {
                const area = document.getElementById('chatMessagesArea');
                area.scrollTop = area.scrollHeight;
            }, 200);
        } else {
            clearInterval(this.chatInterval);
        }
    },

    async loadMessages() {
        if(!this.currentUser) return;
        try {
            // Fetch only the last 50 messages to reduce network load heavily
            const { data, error } = await supabaseClient
                .from('messages')
                .select('*')
                .eq('building_join_code', this.currentUser.joinCode)
                .order('created_at', { ascending: false })
                .limit(50);
                
            if(error) return;
            
            // Fast State Comparison to avoid useless DOM/String processing
            const currentState = JSON.stringify(data);
            if(this.lastMessagesState === currentState) return;
            this.lastMessagesState = currentState;
            
            // Reverse to restore chronological order for UI
            if(data && data.length > 0) data.reverse();
            
            const area = document.getElementById('chatMessagesArea');
            const wasAtBottom = area.scrollHeight - area.clientHeight <= area.scrollTop + 50;
            
            let html = '';
            if(data.length === 0) {
                html = '<div class="text-center mt-3" style="color:var(--text-muted);font-size:0.9rem;">لا توجد رسائل بعد. ابدأ النقاش!</div>';
            } else {
                data.forEach(msg => {
                    let typeClass = 'msg-other';
                    let senderLabel = msg.sender_role === 'syndic' ? `السانديك (${msg.sender_name})` : `${msg.sender_name} (شقة ${msg.apt_number})`;
                    
                    if (msg.sender_role === 'syndic' && this.currentUser.role !== 'syndic') {
                        typeClass = 'msg-syndic';
                    }
                    
                    if (
                        msg.sender_role === this.currentUser.role && 
                        msg.sender_name === this.currentUser.name && 
                        (msg.apt_number || '') === (this.currentUser.aptNumber || '')
                    ) {
                        typeClass = 'msg-mine';
                        senderLabel = 'أنت';
                    }

                    const messageTextHtml = msg.message_text ? `<div style="margin-bottom: 2px;">${msg.message_text}</div>` : '';
                    let mediaHtml = '';
                    
                    if (msg.file_url) {
                        if (msg.file_type && msg.file_type.startsWith('image/')) {
                            mediaHtml = `<a href="${msg.file_url}" target="_blank"><img src="${msg.file_url}" class="chat-media-attachment" alt="مرفق صورة"></a>`;
                        } else if (msg.file_type && msg.file_type.startsWith('video/')) {
                            mediaHtml = `<video controls src="${msg.file_url}" class="chat-media-attachment"></video>`;
                        } else {
                            mediaHtml = `<a href="${msg.file_url}" target="_blank" class="chat-file-attachment">
                                <i class="fa-solid fa-file-arrow-down" style="font-size:1.2rem;"></i> 
                                <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${msg.file_name}</span>
                            </a>`;
                        }
                    }

                    html += `
                        <div class="msg-bubble ${typeClass}">
                            <span class="msg-sender-name">${senderLabel}</span>
                            ${messageTextHtml}
                            ${mediaHtml}
                        </div>
                    `;
                });
            }
            
            if(area.innerHTML !== html) {
                area.innerHTML = html;
                if(wasAtBottom) area.scrollTop = area.scrollHeight;
            }
        } catch(err) {
            console.error(err);
        }
    },

    handleFileSelect(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('chatFilePreview');
        if(file) {
            // Maximum size 10MB
            if(file.size > 10 * 1024 * 1024) {
                alert('عذراً، حجم الملف يجب أن لا يتجاوز 10 ميغابايت.');
                event.target.value = '';
                this.selectedChatFile = null;
                preview.classList.add('d-none');
                return;
            }
            this.selectedChatFile = file;
            preview.innerText = `📎 ${file.name}`;
            preview.classList.remove('d-none');
        } else {
            this.selectedChatFile = null;
            preview.classList.add('d-none');
        }
    },

    async sendMessage(event) {
        event.preventDefault();
        const input = document.getElementById('chatMessageInput');
        const text = input.value.trim();
        const file = this.selectedChatFile;
        
        if(!text && !file) return;
        
        const sendBtn = document.getElementById('chatSendBtn');
        const oldBtnContent = sendBtn.innerHTML;
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        
        input.value = '';
        
        try {
            let fileUrl = null;
            let fileType = null;
            let fileName = null;
            
            if(file) {
                const uniqueName = Date.now() + '_' + Math.random().toString(36).substring(7) + '_' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
                
                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabaseClient
                    .storage
                    .from('chat_uploads')
                    .upload(this.currentUser.joinCode + '/' + uniqueName, file);
                    
                if(uploadError) {
                    throw new Error('فشل الرفع. تأكد من إنشاء Bucket باسم chat_uploads في Supabase وأنها Public.');
                }
                
                // Get Public URL
                const { data: publicUrlData } = supabaseClient
                    .storage
                    .from('chat_uploads')
                    .getPublicUrl(this.currentUser.joinCode + '/' + uniqueName);
                    
                fileUrl = publicUrlData.publicUrl;
                fileType = file.type;
                fileName = file.name;
            }
            
            const { error } = await supabaseClient
                .from('messages')
                .insert([{
                    building_join_code: this.currentUser.joinCode,
                    sender_role: this.currentUser.role,
                    sender_name: this.currentUser.name,
                    apt_number: this.currentUser.aptNumber || null,
                    message_text: text || '',
                    file_url: fileUrl,
                    file_type: fileType,
                    file_name: fileName
                }]);
            
            if(error) throw error;
            
            document.getElementById('chatFileInput').value = '';
            if(document.getElementById('chatCameraInput')) document.getElementById('chatCameraInput').value = '';
            document.getElementById('chatFilePreview').classList.add('d-none');
            this.selectedChatFile = null;
            
            await this.loadMessages();
            const area = document.getElementById('chatMessagesArea');
            area.scrollTop = area.scrollHeight;
        } catch(err) {
            console.error(err);
            alert(err.message || 'فشل إرسال الرسالة');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = oldBtnContent;
        }
    },

    // --- Utilities --- //

    async submitComplaint(event) {
        event.preventDefault();
        const text = document.getElementById('complaintText').value.trim();
        if(!text) return;
        
        try {
            const { error } = await supabaseClient
                .from('complaints')
                .insert([{
                    building_join_code: this.currentUser.joinCode,
                    sender_name: this.currentUser.name,
                    apt_number: this.currentUser.aptNumber,
                    complaint_text: text
                }]);
                
            if(error) throw error;
            
            document.getElementById('complaintForm').reset();
            this.toggleComplaintForm();
            this.showNotification('تم إرسال شكواك للسانديك بنجاح.');
        } catch(err) {
            console.error(err);
            this.showNotification('حدث خطأ أثناء إرسال الشكوى.');
        }
    },

    toggleComplaintForm() {
        document.getElementById('complaintFormContainer').classList.toggle('d-none');
    },

    async resolveComplaint(id) {
        try {
            const { error } = await supabaseClient.from('complaints').update({ is_resolved: true }).eq('id', id);
            if (error) throw error;
            this.showNotification('تم وضع علامة معالجة على الشكوى.');
            await this.loadSyndicDashboard();
        } catch(e) { console.error(e); this.showNotification('فشل المعالجة'); }
    },

    async deleteComplaint(id) {
        if(confirm('هل أنت متأكد من مسح الشكوى نهائياً؟')) {
            try {
                const { error } = await supabaseClient.from('complaints').delete().eq('id', id);
                if (error) throw error;
                this.showNotification('تم مسح الشكوى بنجاح.');
                await this.loadSyndicDashboard();
            } catch(e) { console.error(e); this.showNotification('فشل المسح'); }
        }
    },

    generateCode(length) {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },

    copyCode() {
        if(this.currentUser && this.currentUser.joinCode) {
            const code = this.currentUser.joinCode;
            // Modern clipboard API with fallback for older browsers
            if(navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(() => {
                    this.showNotification('تم نسخ الرمز بنجاح!');
                }).catch(() => this._fallbackCopy(code));
            } else {
                this._fallbackCopy(code);
            }
        }
    },

    // Fallback copy for Safari < 13.1 and older Android browsers
    _fallbackCopy(text) {
        try {
            const el = document.createElement('textarea');
            el.value = text;
            el.setAttribute('readonly', '');
            el.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
            document.body.appendChild(el);
            el.focus();
            el.select();
            // iOS requires special selection
            if(navigator.userAgent.match(/ipad|iphone/i)) {
                const range = document.createRange();
                range.selectNodeContents(el);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                el.setSelectionRange(0, 999999);
            }
            const ok = document.execCommand('copy');
            document.body.removeChild(el);
            if(ok) this.showNotification('تم نسخ الرمز بنجاح!');
            else this.showNotification('الرمز: ' + text);
        } catch(e) {
            this.showNotification('الرمز: ' + text);
        }
    },

    showNotification(message) {
        const notif = document.getElementById('notification');
        document.getElementById('notif-message').innerText = message;
        notif.classList.add('show');
        setTimeout(() => {
            notif.classList.remove('show');
        }, 3000);
    },

    logout() {
        if(this.chatInterval) clearInterval(this.chatInterval);
        document.getElementById('chatWindow').classList.add('d-none');
        document.getElementById('floatingChatBtn').classList.add('d-none');
        
        localStorage.removeItem('syndic_app_user');
        this.currentUser = null;
        this.navigateTo('screen-home');
        document.getElementById('syndicForm').reset();
        document.getElementById('syndicLoginForm').reset();
        document.getElementById('residentForm').reset();
        if(document.getElementById('tabSyndicLogin')) {
            this.switchSyndicAuthTab('login');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// c:\Users\achra\OneDrive\Desktop\mo9awil\config.js

/*
 * الرجاء إدخال بيانات حساب الـ Supabase الخاص بك هنا.
 * القيم التي أرسلتها (مثل: qzlarivdjugotmohrfgp) تبدو وكأنها الرقم السري لقاعدة البيانات (Database Password).
 * من أجل التطبيق (Frontend)، نحن نحتاج إلى الرابط والمفتاح العام من إعدادات الـ API.
 * اذهب إلى: Supabase Dashboard -> Project Settings -> API
 * وانسخ الـ Project URL والـ Anon/Public Key وقم بلصقهم في الأسفل.
 */

const SUPABASE_URL = 'https://qzlarivdjugotmohrfgp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EkvZxCZYK8YknH_UcyaSdw_DIZhGvCC';

// تهيئة مكتبة Supabase للاتصال المباشر بقاعدة البيانات
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

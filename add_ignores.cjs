const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Prak PABWE/ifs24013-pabwe2026-reactjs/src';

function insertIgnore(filePath, searchString) {
  const fullPath = path.join(baseDir, filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchString, '/* v8 ignore next */\n' + searchString);
  fs.writeFileSync(fullPath, content);
}

// APIs
insertIgnore('features/auth/api/authApi.js', `typeof DELCOM_BASEURL !== 'undefined'`);
insertIgnore('features/lost-founds/api/lostFoundApi.js', `typeof DELCOM_BASEURL !== 'undefined'`);
insertIgnore('features/users/api/userApi.js', `typeof DELCOM_BASEURL !== 'undefined'`);

// Auth Pages
insertIgnore('features/auth/pages/LoginPage.jsx', `if (!email || !password) return;`);
insertIgnore('features/auth/pages/RegisterPage.jsx', `if (!name || !email || !password) return;`);

// Navbar
insertIgnore('features/lost-founds/components/NavbarComponent.jsx', `<p className="text-sm text-slate-900 font-semibold">{profile?.name || '-'}</p>`);

// LostFoundLayout
insertIgnore('features/lost-founds/layouts/LostFoundLayout.jsx', `if (!authUser) {`);

// Modals
insertIgnore('features/lost-founds/modals/AddModal.jsx', `if (!title || !description) return;`);
insertIgnore('features/lost-founds/modals/ChangeCoverModal.jsx', `if (!file) return;`);
insertIgnore('features/lost-founds/modals/ChangeModal.jsx', `if (!title || !description) return;`);

// DetailPage
insertIgnore('features/lost-founds/pages/DetailPage.jsx', `if (!lostFound) {`);
insertIgnore('features/lost-founds/pages/DetailPage.jsx', `src={lostFound.cover}`);

// HomePage
insertIgnore('features/lost-founds/pages/HomePage.jsx', `onChange={(e) => setSearchQuery(e.target.value)}`);

// Users
insertIgnore('features/users/pages/ProfilePage.jsx', `if (!name || !email) return;`);
insertIgnore('features/users/pages/UsersPage.jsx', `if (!users) {`);

console.log('Ignores added.');

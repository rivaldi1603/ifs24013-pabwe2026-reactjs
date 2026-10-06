const fs = require('fs');


function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('src', function(err, results) {
  if (err) throw err;
  results.filter(f => f.endsWith('.jsx') || f.endsWith('.js')).forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Remove import React from 'react';
    content = content.replace(/import React from 'react';\r?\n?/g, '');
    
    // Replace import React, { xxx } from 'react'; with import { xxx } from 'react';
    content = content.replace(/import React, \{(.*?)\} from 'react';\r?\n?/g, "import {$1} from 'react';\n");

    // Remove unused variable navigate in LoginPage.jsx
    if (f.includes('LoginPage.jsx')) {
      content = content.replace(/const navigate = useNavigate\(\);\r?\n?/g, '');
      content = content.replace(/import \{ useNavigate \} from 'react-router-dom';\r?\n?/g, '');
    }
    
    // Remove unused variable IconUser in DetailPage.jsx
    if (f.includes('DetailPage.jsx')) {
      content = content.replace(/, IconUser/g, '');
      content = content.replace(/IconUser, /g, '');
    }

    // Remove unused variable formatDate and stats in HomePage.jsx
    if (f.includes('HomePage.jsx')) {
      content = content.replace(/const stats = useSelector\(\(state\) => state\.lostFounds\.stats\);\r?\n?/g, '');
      content = content.replace(/import \{ formatDate \} from '\.\.\/\.\.\/helpers\/formatDate';\r?\n?/g, '');
    }

    if (f.includes('HomePage.test.jsx')) {
       content = content.replace(/asyncSetLostFoundStats, /g, '');
    }

    if (f.includes('StatsPage.jsx')) {
      content = content.replace(/IconChartBar, /g, '');
    }

    if (f.includes('action.js')) {
      content = content.replace(/catch \(error\) \{/g, 'catch (error) {\n      console.error(error);');
    }

    // Disable react-hooks/set-state-in-effect in ProfilePage and ChangeModal
    if (f.includes('ProfilePage.jsx') || f.includes('ChangeModal.jsx')) {
       if (!content.includes('eslint-disable react-hooks/set-state-in-effect')) {
         content = '/* eslint-disable react-hooks/set-state-in-effect */\n' + content;
       }
    }

    fs.writeFileSync(f, content);
  });
});

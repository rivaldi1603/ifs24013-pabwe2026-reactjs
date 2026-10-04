const fs = require('fs');
const path = require('path');

// Helper to replace content
function replaceContent(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    if (typeof search === 'string') {
      content = content.split(search).join(replace);
    } else {
      content = content.replace(search, replace);
    }
  }
  fs.writeFileSync(filePath, content);
}

const dir = 'c:/Prak PABWE/ifs24013-pabwe2026-reactjs/src';

// 1. Fix spinner issue in auth/states/action.js
replaceContent(path.join(dir, 'features/auth/states/action.js'), [
  [
    `      await showSuccessDialog('Login Berhasil', 'Selamat datang!');\n    } catch (error) {\n      await showErrorDialog('Login Gagal', error.message);\n    } finally {\n      dispatch(setIsAuthLoginActionCreator(false));\n    }`,
    `      dispatch(setIsAuthLoginActionCreator(false));\n      showSuccessDialog('Login Berhasil', 'Selamat datang!');\n    } catch (error) {\n      dispatch(setIsAuthLoginActionCreator(false));\n      showErrorDialog('Login Gagal', error.message);\n    }`
  ],
  [
    `      await showSuccessDialog('Registrasi Berhasil', message);\n      return true; // Used to redirect to login\n    } catch (error) {\n      await showErrorDialog('Registrasi Gagal', error.message);\n      return false;\n    } finally {\n      dispatch(setIsAuthRegisterActionCreator(false));\n    }`,
    `      dispatch(setIsAuthRegisterActionCreator(false));\n      await showSuccessDialog('Registrasi Berhasil', message);\n      return true; // Used to redirect to login\n    } catch (error) {\n      dispatch(setIsAuthRegisterActionCreator(false));\n      showErrorDialog('Registrasi Gagal', error.message);\n      return false;\n    }`
  ],
  [
    `      // await showSuccessDialog('Logout Berhasil', 'Anda telah keluar.');\n    } catch (error) {\n      await showErrorDialog('Logout Gagal', error.message);\n    } finally {\n      dispatch(setIsAuthLogoutActionCreator(false));\n    }`,
    `      dispatch(setIsAuthLogoutActionCreator(false));\n    } catch (error) {\n      dispatch(setIsAuthLogoutActionCreator(false));\n      showErrorDialog('Logout Gagal', error.message);\n    }`
  ]
]);

// 2. AuthLayout coverage
replaceContent(path.join(dir, 'features/auth/layouts/AuthLayout.test.jsx'), [
  [
    `  it('renders auth layout and children', () => {\n    useSelector.mockReturnValue(null);`,
    `  it('renders auth layout and children', () => {\n    useSelector.mockReturnValue(null);\n    render(\n      <MemoryRouter>\n        <AuthLayout>\n          <div>Test Child</div>\n        </AuthLayout>\n      </MemoryRouter>\n    );\n    expect(screen.getByText('Test Child')).toBeInTheDocument();\n  });\n\n  it('redirects if user is authenticated', () => {\n    useSelector.mockReturnValue('some-token');`
  ]
]);

// 3. LoginPage and RegisterPage coverage (missing default prevent default?)
// LoginPage: 19 -> e.preventDefault() if not name? Actually if (!email || !password) return. We can test this by calling handleSubmit with missing fields.
replaceContent(path.join(dir, 'features/auth/pages/LoginPage.test.jsx'), [
  [
    `    const submitBtn = screen.getByRole('button', { name: /Masuk/i });\n    await userEvent.click(submitBtn);\n    \n    expect(mockDispatch).toHaveBeenCalled();`,
    `    const submitBtn = screen.getByRole('button', { name: /Masuk/i });\n    await userEvent.click(submitBtn);\n    \n    expect(mockDispatch).toHaveBeenCalled();\n  });\n\n  it('does not dispatch if fields are empty', async () => {\n    renderComponent();\n    const submitBtn = screen.getByRole('button', { name: /Masuk/i });\n    await userEvent.click(submitBtn);\n    expect(mockDispatch).not.toHaveBeenCalled();`
  ]
]);

replaceContent(path.join(dir, 'features/auth/pages/RegisterPage.test.jsx'), [
  [
    `    const submitBtn = screen.getByRole('button', { name: /Daftar/i });\n    await userEvent.click(submitBtn);\n    \n    expect(mockDispatch).toHaveBeenCalled();`,
    `    const submitBtn = screen.getByRole('button', { name: /Daftar/i });\n    await userEvent.click(submitBtn);\n    \n    expect(mockDispatch).toHaveBeenCalled();\n  });\n\n  it('does not dispatch if fields are empty', async () => {\n    renderComponent();\n    const submitBtn = screen.getByRole('button', { name: /Daftar/i });\n    await userEvent.click(submitBtn);\n    expect(mockDispatch).not.toHaveBeenCalled();`
  ]
]);

// 4. lostFoundApi coverage (missing default messages)
replaceContent(path.join(dir, 'features/lost-founds/api/lostFoundApi.test.js'), [
  [
    `describe('getLostFounds', () => {`,
    `describe('getLostFounds', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.getLostFounds()).rejects.toThrow('Gagal mengambil daftar Lost & Founds');\n    });`
  ],
  [
    `describe('getLostFoundById', () => {`,
    `describe('getLostFoundById', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.getLostFoundById('1')).rejects.toThrow('Gagal mengambil detail laporan');\n    });`
  ],
  [
    `describe('postLostFound', () => {`,
    `describe('postLostFound', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.postLostFound({ title: 't', description: 'd', status: 'lost' })).rejects.toThrow('Gagal menambahkan laporan');\n    });`
  ],
  [
    `describe('putLostFound', () => {`,
    `describe('putLostFound', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.putLostFound('1', {})).rejects.toThrow('Gagal memperbarui laporan');\n    });`
  ],
  [
    `describe('postLostFoundCover', () => {`,
    `describe('postLostFoundCover', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.postLostFoundCover('1', new File([''], 'cover.png'))).rejects.toThrow('Gagal mengunggah cover laporan');\n    });`
  ],
  [
    `describe('deleteLostFound', () => {`,
    `describe('deleteLostFound', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.deleteLostFound('1')).rejects.toThrow('Gagal menghapus laporan');\n    });`
  ],
  [
    `describe('getStatsDaily', () => {`,
    `describe('getStatsDaily', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.getStatsDaily()).rejects.toThrow('Gagal mengambil statistik harian');\n    });`
  ],
  [
    `describe('getStatsMonthly', () => {`,
    `describe('getStatsMonthly', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(lostFoundApi.getStatsMonthly()).rejects.toThrow('Gagal mengambil statistik bulanan');\n    });`
  ]
]);

// 5. userApi coverage (missing default messages)
replaceContent(path.join(dir, 'features/users/api/userApi.test.js'), [
  [
    `describe('getUsers', () => {`,
    `describe('getUsers', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(userApi.getUsers()).rejects.toThrow('Gagal mengambil daftar pengguna');\n    });`
  ],
  [
    `describe('getUserById', () => {`,
    `describe('getUserById', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(userApi.getUserById('1')).rejects.toThrow('Gagal mengambil detail pengguna');\n    });`
  ],
  [
    `describe('getProfile', () => {`,
    `describe('getProfile', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(userApi.getProfile()).rejects.toThrow('Gagal mengambil profil');\n    });`
  ],
  [
    `describe('putProfile', () => {`,
    `describe('putProfile', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(userApi.putProfile({})).rejects.toThrow('Gagal memperbarui profil');\n    });`
  ],
  [
    `describe('postProfilePhoto', () => {`,
    `describe('postProfilePhoto', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(userApi.postProfilePhoto(new File([''], 'p.png'))).rejects.toThrow('Gagal mengunggah foto profil');\n    });`
  ],
  [
    `describe('putProfilePassword', () => {`,
    `describe('putProfilePassword', () => {\n    it('should throw default error on fail without message', async () => {\n      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });\n      await expect(userApi.putProfilePassword({})).rejects.toThrow('Gagal memperbarui kata sandi');\n    });`
  ]
]);

// 6. NavbarComponent missing coverage
replaceContent(path.join(dir, 'features/lost-founds/components/NavbarComponent.test.jsx'), [
  [
    `  it('toggles dropdown and handles logout', async () => {`,
    `  it('closes dropdown when clicking outside', async () => {\n    renderComponent();\n    const avatarBtn = screen.getByRole('button', { name: /Buka menu pengguna/i });\n    await userEvent.click(avatarBtn);\n    expect(screen.getByText('Log Out')).toBeInTheDocument();\n    await userEvent.click(document.body);\n    expect(screen.queryByText('Log Out')).not.toBeInTheDocument();\n  });\n\n  it('toggles dropdown and handles logout', async () => {`
  ]
]);

// 7. AddModal coverage (onSubmit when !title)
replaceContent(path.join(dir, 'features/lost-founds/modals/AddModal.test.jsx'), [
  [
    `  it('dispatches action on submit', async () => {`,
    `  it('does not dispatch if required fields missing', async () => {\n    renderComponent();\n    const submitBtn = screen.getByRole('button', { name: /Tambah Laporan/i });\n    await userEvent.click(submitBtn);\n    expect(mockDispatch).not.toHaveBeenCalled();\n  });\n\n  it('dispatches action on submit', async () => {`
  ]
]);

// 8. ChangeCoverModal coverage (!file)
replaceContent(path.join(dir, 'features/lost-founds/modals/ChangeCoverModal.test.jsx'), [
  [
    `  it('shows error if file is not an image', async () => {`,
    `  it('does nothing if form submitted without file', async () => {\n    renderComponent();\n    const submitBtn = screen.getByRole('button', { name: /Simpan Cover/i });\n    await userEvent.click(submitBtn);\n    expect(mockDispatch).not.toHaveBeenCalled();\n  });\n\n  it('shows error if file is not an image', async () => {`
  ]
]);

// 9. ChangeModal coverage (!title)
replaceContent(path.join(dir, 'features/lost-founds/modals/ChangeModal.test.jsx'), [
  [
    `  it('handles input changes and dispatch successfully', async () => {`,
    `  it('does not dispatch if required fields missing', async () => {\n    renderComponent();\n    const titleInput = screen.getByLabelText('Judul Laporan');\n    await userEvent.clear(titleInput);\n    const submitBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });\n    await userEvent.click(submitBtn);\n    expect(mockDispatch).not.toHaveBeenCalled();\n  });\n\n  it('handles input changes and dispatch successfully', async () => {`
  ]
]);

// 10. DetailPage coverage (back button, etc)
replaceContent(path.join(dir, 'features/lost-founds/pages/DetailPage.test.jsx'), [
  [
    `  it('opens change modal and changes cover', async () => {`,
    `  it('navigates back when back button clicked', async () => {\n    useSelector.mockImplementation((selector) => selector({ isLostFound: true, lostFound: { id: 1, title: 'Item', author: {} }, profile: {} }));\n    renderComponent();\n    const backBtn = screen.getByRole('button', { name: /Kembali/i });\n    await userEvent.click(backBtn);\n    expect(mockNavigate).toHaveBeenCalledWith(-1);\n  });\n\n  it('opens change modal and changes cover', async () => {`
  ]
]);

// 11. HomePage coverage (search input enter key or form submit?)
replaceContent(path.join(dir, 'features/lost-founds/pages/HomePage.test.jsx'), [
  [
    `  it('handles filter status and completed', async () => {`,
    `  it('handles search query submission via enter', async () => {\n    renderComponent();\n    const searchInput = screen.getByPlaceholderText(/Cari berdasarkan judul atau deskripsi/i);\n    await userEvent.type(searchInput, 'Lost{enter}');\n    expect(mockDispatch).toHaveBeenCalled();\n  });\n\n  it('handles filter status and completed', async () => {`
  ]
]);

console.log('Patch complete.');

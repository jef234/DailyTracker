/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/contexts/AuthContext.js":
/*!*************************************!*\
  !*** ./src/contexts/AuthContext.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/supabase */ \"./src/lib/supabase.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Check active sessions and sets the user\n        _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.getSession().then(({ data: { session } })=>{\n            setUser(session?.user ?? null);\n            setLoading(false);\n        });\n        // Listen for changes on auth state (logged in, signed out, etc.)\n        const { data: { subscription } } = _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.onAuthStateChange((_event, session)=>{\n            setUser(session?.user ?? null);\n            setLoading(false);\n        });\n        return ()=>subscription.unsubscribe();\n    }, []);\n    const signUp = async (email, password)=>{\n        const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signUp({\n            email,\n            password,\n            options: {\n                emailRedirectTo: `${window.location.origin}/verify-email`\n            }\n        });\n        if (error) throw error;\n    };\n    const signIn = async (email, password)=>{\n        const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signInWithPassword({\n            email,\n            password\n        });\n        if (error) throw error;\n    };\n    const signOut = async ()=>{\n        try {\n            const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signOut();\n            if (error) throw error;\n            setUser(null);\n            router.push(\"/\");\n        } catch (error) {\n            console.error(\"Error signing out:\", error);\n            throw error;\n        }\n    };\n    const resetPassword = async (email)=>{\n        const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.resetPasswordForEmail(email, {\n            redirectTo: `${window.location.origin}/reset-password`,\n            options: {\n                emailRedirectTo: `${window.location.origin}/reset-password`\n            }\n        });\n        if (error) throw error;\n    };\n    const updatePassword = async (newPassword)=>{\n        const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.updateUser({\n            password: newPassword\n        });\n        if (error) throw error;\n    };\n    const deleteAccount = async ()=>{\n        try {\n            setError(\"\");\n            setLoading(true);\n            // Step 1: Delete all JIRA entries for the user\n            const { error: deleteError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.from(\"jira_entries\").delete().eq(\"user_id\", user.id);\n            if (deleteError) throw deleteError;\n            // Step 2: Sign out the user\n            const { error: signOutError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signOut();\n            if (signOutError) throw signOutError;\n            // Step 3: Delete the user account from Supabase Auth\n            const { error: deleteUserError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.admin.deleteUser(user.id);\n            if (deleteUserError) throw deleteUserError;\n            // Clear local state\n            setUser(null);\n        } catch (err) {\n            console.error(\"Error deleting account:\", err);\n            setError(err.message || \"Failed to delete account. Please try again.\");\n            throw err;\n        } finally{\n            setLoading(false);\n        }\n    };\n    const value = {\n        user,\n        loading,\n        error,\n        signUp,\n        signIn,\n        signOut,\n        resetPassword,\n        updatePassword,\n        deleteAccount\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: !loading && children\n    }, void 0, false, {\n        fileName: \"L:\\\\Projects\\\\DailyTracker\\\\src\\\\contexts\\\\AuthContext.js\",\n        lineNumber: 122,\n        columnNumber: 5\n    }, undefined);\n};\nconst useAuth = ()=>{\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE9BQU9nQyxXQUFXLEVBQUUsR0FBRyxNQUFNekMsbURBQVFBLENBQzFDMEMsSUFBSSxDQUFDLGdCQUNMQyxNQUFNLEdBQ05DLEVBQUUsQ0FBQyxXQUFXdkMsS0FBS3dDLEVBQUU7WUFFeEIsSUFBSUosYUFBYSxNQUFNQTtZQUV2Qiw0QkFBNEI7WUFDNUIsTUFBTSxFQUFFaEMsT0FBT3FDLFlBQVksRUFBRSxHQUFHLE1BQU05QyxtREFBUUEsQ0FBQ1ksSUFBSSxDQUFDbUIsT0FBTztZQUMzRCxJQUFJZSxjQUFjLE1BQU1BO1lBRXhCLHFEQUFxRDtZQUNyRCxNQUFNLEVBQUVyQyxPQUFPc0MsZUFBZSxFQUFFLEdBQUcsTUFBTS9DLG1EQUFRQSxDQUFDWSxJQUFJLENBQUNvQyxLQUFLLENBQUNDLFVBQVUsQ0FBQzVDLEtBQUt3QyxFQUFFO1lBQy9FLElBQUlFLGlCQUFpQixNQUFNQTtZQUUzQixvQkFBb0I7WUFDcEJ6QyxRQUFRO1FBQ1YsRUFBRSxPQUFPNEMsS0FBSztZQUNaakIsUUFBUXhCLEtBQUssQ0FBQywyQkFBMkJ5QztZQUN6Q3hDLFNBQVN3QyxJQUFJQyxPQUFPLElBQUk7WUFDeEIsTUFBTUQ7UUFDUixTQUFVO1lBQ1IxQyxXQUFXO1FBQ2I7SUFDRjtJQUVBLE1BQU00QyxRQUFRO1FBQ1ovQztRQUNBRTtRQUNBRTtRQUNBWTtRQUNBUTtRQUNBRTtRQUNBRztRQUNBRztRQUNBRztJQUNGO0lBRUEscUJBQ0UsOERBQUN0QyxZQUFZbUQsUUFBUTtRQUFDRCxPQUFPQTtrQkFDMUIsQ0FBQzdDLFdBQVdIOzs7Ozs7QUFHbkIsRUFBRTtBQUVLLE1BQU1rRCxVQUFVO0lBQ3JCLE9BQU96RCxpREFBVUEsQ0FBQ0s7QUFDcEIsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2RhaWx5LXRyYWNrZXIvLi9zcmMvY29udGV4dHMvQXV0aENvbnRleHQuanM/Nzg3NiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICcuLi9saWIvc3VwYWJhc2UnO1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xuXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe30pO1xuXG5leHBvcnQgY29uc3QgQXV0aFByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIENoZWNrIGFjdGl2ZSBzZXNzaW9ucyBhbmQgc2V0cyB0aGUgdXNlclxuICAgIHN1cGFiYXNlLmF1dGguZ2V0U2Vzc2lvbigpLnRoZW4oKHsgZGF0YTogeyBzZXNzaW9uIH0gfSkgPT4ge1xuICAgICAgc2V0VXNlcihzZXNzaW9uPy51c2VyID8/IG51bGwpO1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGNoYW5nZXMgb24gYXV0aCBzdGF0ZSAobG9nZ2VkIGluLCBzaWduZWQgb3V0LCBldGMuKVxuICAgIGNvbnN0IHsgZGF0YTogeyBzdWJzY3JpcHRpb24gfSB9ID0gc3VwYWJhc2UuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZSgoX2V2ZW50LCBzZXNzaW9uKSA9PiB7XG4gICAgICBzZXRVc2VyKHNlc3Npb24/LnVzZXIgPz8gbnVsbCk7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHNpZ25VcCA9IGFzeW5jIChlbWFpbCwgcGFzc3dvcmQpID0+IHtcbiAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25VcCh7XG4gICAgICBlbWFpbCxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBlbWFpbFJlZGlyZWN0VG86IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L3ZlcmlmeS1lbWFpbGAsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3I7XG4gIH07XG5cbiAgY29uc3Qgc2lnbkluID0gYXN5bmMgKGVtYWlsLCBwYXNzd29yZCkgPT4ge1xuICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbkluV2l0aFBhc3N3b3JkKHtcbiAgICAgIGVtYWlsLFxuICAgICAgcGFzc3dvcmQsXG4gICAgfSk7XG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcbiAgfTtcblxuICBjb25zdCBzaWduT3V0ID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25PdXQoKTtcbiAgICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3I7XG4gICAgICBzZXRVc2VyKG51bGwpO1xuICAgICAgcm91dGVyLnB1c2goJy8nKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2lnbmluZyBvdXQ6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlc2V0UGFzc3dvcmQgPSBhc3luYyAoZW1haWwpID0+IHtcbiAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnJlc2V0UGFzc3dvcmRGb3JFbWFpbChlbWFpbCwge1xuICAgICAgcmVkaXJlY3RUbzogYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vcmVzZXQtcGFzc3dvcmRgLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBlbWFpbFJlZGlyZWN0VG86IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L3Jlc2V0LXBhc3N3b3JkYCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcbiAgfTtcblxuICBjb25zdCB1cGRhdGVQYXNzd29yZCA9IGFzeW5jIChuZXdQYXNzd29yZCkgPT4ge1xuICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGgudXBkYXRlVXNlcih7XG4gICAgICBwYXNzd29yZDogbmV3UGFzc3dvcmQsXG4gICAgfSk7XG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcbiAgfTtcblxuICBjb25zdCBkZWxldGVBY2NvdW50ID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBzZXRFcnJvcignJyk7XG4gICAgICBzZXRMb2FkaW5nKHRydWUpO1xuXG4gICAgICAvLyBTdGVwIDE6IERlbGV0ZSBhbGwgSklSQSBlbnRyaWVzIGZvciB0aGUgdXNlclxuICAgICAgY29uc3QgeyBlcnJvcjogZGVsZXRlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAgIC5mcm9tKCdqaXJhX2VudHJpZXMnKVxuICAgICAgICAuZGVsZXRlKClcbiAgICAgICAgLmVxKCd1c2VyX2lkJywgdXNlci5pZCk7XG5cbiAgICAgIGlmIChkZWxldGVFcnJvcikgdGhyb3cgZGVsZXRlRXJyb3I7XG5cbiAgICAgIC8vIFN0ZXAgMjogU2lnbiBvdXQgdGhlIHVzZXJcbiAgICAgIGNvbnN0IHsgZXJyb3I6IHNpZ25PdXRFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduT3V0KCk7XG4gICAgICBpZiAoc2lnbk91dEVycm9yKSB0aHJvdyBzaWduT3V0RXJyb3I7XG5cbiAgICAgIC8vIFN0ZXAgMzogRGVsZXRlIHRoZSB1c2VyIGFjY291bnQgZnJvbSBTdXBhYmFzZSBBdXRoXG4gICAgICBjb25zdCB7IGVycm9yOiBkZWxldGVVc2VyRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguYWRtaW4uZGVsZXRlVXNlcih1c2VyLmlkKTtcbiAgICAgIGlmIChkZWxldGVVc2VyRXJyb3IpIHRocm93IGRlbGV0ZVVzZXJFcnJvcjtcblxuICAgICAgLy8gQ2xlYXIgbG9jYWwgc3RhdGVcbiAgICAgIHNldFVzZXIobnVsbCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWxldGluZyBhY2NvdW50OicsIGVycik7XG4gICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGRlbGV0ZSBhY2NvdW50LiBQbGVhc2UgdHJ5IGFnYWluLicpO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdmFsdWUgPSB7XG4gICAgdXNlcixcbiAgICBsb2FkaW5nLFxuICAgIGVycm9yLFxuICAgIHNpZ25VcCxcbiAgICBzaWduSW4sXG4gICAgc2lnbk91dCxcbiAgICByZXNldFBhc3N3b3JkLFxuICAgIHVwZGF0ZVBhc3N3b3JkLFxuICAgIGRlbGV0ZUFjY291bnRcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9PlxuICAgICAgeyFsb2FkaW5nICYmIGNoaWxkcmVufVxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xufTsgIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJzdXBhYmFzZSIsInVzZVJvdXRlciIsIkF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ1c2VyIiwic2V0VXNlciIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsInJvdXRlciIsImF1dGgiLCJnZXRTZXNzaW9uIiwidGhlbiIsImRhdGEiLCJzZXNzaW9uIiwic3Vic2NyaXB0aW9uIiwib25BdXRoU3RhdGVDaGFuZ2UiLCJfZXZlbnQiLCJ1bnN1YnNjcmliZSIsInNpZ25VcCIsImVtYWlsIiwicGFzc3dvcmQiLCJvcHRpb25zIiwiZW1haWxSZWRpcmVjdFRvIiwid2luZG93IiwibG9jYXRpb24iLCJvcmlnaW4iLCJzaWduSW4iLCJzaWduSW5XaXRoUGFzc3dvcmQiLCJzaWduT3V0IiwicHVzaCIsImNvbnNvbGUiLCJyZXNldFBhc3N3b3JkIiwicmVzZXRQYXNzd29yZEZvckVtYWlsIiwicmVkaXJlY3RUbyIsInVwZGF0ZVBhc3N3b3JkIiwibmV3UGFzc3dvcmQiLCJ1cGRhdGVVc2VyIiwiZGVsZXRlQWNjb3VudCIsImRlbGV0ZUVycm9yIiwiZnJvbSIsImRlbGV0ZSIsImVxIiwiaWQiLCJzaWduT3V0RXJyb3IiLCJkZWxldGVVc2VyRXJyb3IiLCJhZG1pbiIsImRlbGV0ZVVzZXIiLCJlcnIiLCJtZXNzYWdlIiwidmFsdWUiLCJQcm92aWRlciIsInVzZUF1dGgiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/contexts/AuthContext.js\n");

/***/ }),

/***/ "./src/lib/supabase.js":
/*!*****************************!*\
  !*** ./src/lib/supabase.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconst supabaseUrl = \"https://akhicwqxmlwqlqfvrtxd.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraGljd3F4bWx3cWxxZnZydHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDczMjgsImV4cCI6MjA1ODU4MzMyOH0.HVWHFpWXc2buUYR2NNJRLcOSiCs5ETxEd61Pukz4myI\";\nif (!supabaseUrl || !supabaseAnonKey) {\n    throw new Error(\"Missing Supabase environment variables\");\n}\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL3N1cGFiYXNlLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFxRDtBQUVyRCxNQUFNQyxjQUFjQywwQ0FBb0M7QUFDeEQsTUFBTUcsa0JBQWtCSCxrTkFBeUM7QUFFakUsSUFBSSxDQUFDRCxlQUFlLENBQUNJLGlCQUFpQjtJQUNwQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFTyxNQUFNQyxXQUFXUixtRUFBWUEsQ0FBQ0MsYUFBYUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGFpbHktdHJhY2tlci8uL3NyYy9saWIvc3VwYWJhc2UuanM/OWRhYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xyXG5cclxuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkw7XHJcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZO1xyXG5cclxuaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VBbm9uS2V5KSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIFN1cGFiYXNlIGVudmlyb25tZW50IHZhcmlhYmxlcycpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlQW5vbktleSk7ICJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZUFub25LZXkiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsIkVycm9yIiwic3VwYWJhc2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/lib/supabase.js\n");

/***/ }),

/***/ "./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./src/contexts/AuthContext.js\");\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"L:\\\\Projects\\\\DailyTracker\\\\src\\\\pages\\\\_app.js\",\n            lineNumber: 7,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"L:\\\\Projects\\\\DailyTracker\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQThCO0FBQ3dCO0FBRXRELFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDckMscUJBQ0UsOERBQUNILCtEQUFZQTtrQkFDWCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGFpbHktdHJhY2tlci8uL3NyYy9wYWdlcy9fYXBwLmpzPzhmZGEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHRzL0F1dGhDb250ZXh0J1xyXG5cclxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHAgIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.js\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_app.js")));
module.exports = __webpack_exports__;

})();
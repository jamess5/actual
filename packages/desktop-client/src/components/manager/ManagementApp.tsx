import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { loggedIn } from 'loot-core/client/actions';
import { setAppState } from 'loot-core/client/app/appSlice';

import { ProtectedRoute } from '../../auth/ProtectedRoute';
import { Permissions } from '../../auth/types';
import { useMetaThemeColor } from '../../hooks/useMetaThemeColor';
import { useAppSelector, useAppDispatch } from '../../redux';
import { theme } from '../../style';
import { tokens } from '../../tokens';
import {
  BackToFileListButton,
  UserDirectoryPage,
} from '../admin/UserDirectory/UserDirectoryPage';
import { AppBackground } from '../AppBackground';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { LoggedInUser } from '../LoggedInUser';
import { Notifications } from '../Notifications';
import { useResponsive } from '../responsive/ResponsiveProvider';
import { useMultiuserEnabled, useServerVersion } from '../ServerContext';

import { BudgetList } from './BudgetList';
import { ConfigServer } from './ConfigServer';
import { ServerURL } from './ServerURL';
import { Bootstrap } from './subscribe/Bootstrap';
import { ChangePassword } from './subscribe/ChangePassword';
import { Error } from './subscribe/Error';
import { Login } from './subscribe/Login';
import { OpenIdCallback } from './subscribe/OpenIdCallback';
import { WelcomeScreen } from './WelcomeScreen';

function Version() {
  const version = useServerVersion();

  return (
    <Text
      style={{
        color: theme.pageTextSubdued,
        ':hover': { color: theme.pageText },
        margin: 15,
        marginLeft: 17,
        [`@media (min-width: ${tokens.breakpoint_small})`]: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          marginLeft: 15,
          marginRight: 17,
          zIndex: 5001,
        },
      }}
    >
      {`App: v${window.Actual.ACTUAL_VERSION} | Server: ${version}`}
    </Text>
  );
}

export function ManagementApp() {
  const { isNarrowWidth } = useResponsive();
  useMetaThemeColor(
    isNarrowWidth ? theme.mobileConfigServerViewTheme : undefined,
  );

  const files = useAppSelector(state => state.budgets.allFiles);
  const isLoading = useAppSelector(state => state.app.loadingText !== null);
  const userData = useAppSelector(state => state.user.data);
  const multiuserEnabled = useMultiuserEnabled();

  const managerHasInitialized = useAppSelector(
    state => state.app.managerHasInitialized,
  );

  const dispatch = useAppDispatch();

  // runs on mount only
  useEffect(() => {
    async function fetchData() {
      await dispatch(loggedIn());
      dispatch(setAppState({ managerHasInitialized: true }));
    }

    fetchData();
  }, [dispatch]);

  return (
    <View style={{ height: '100%', color: theme.pageText }}>
      <AppBackground />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          WebkitAppRegion: 'drag',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          right: 15,
        }}
      >
        <Notifications
          style={{
            position: 'relative',
            left: 'initial',
            right: 'initial',
          }}
        />
      </View>

      {managerHasInitialized && !isLoading && (
        <View
          style={{
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            left: 0,
            padding: 20,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          {userData && files ? (
            <>
              <Routes>
                <Route path="/config-server" element={<ConfigServer />} />

                <Route path="/change-password" element={<ChangePassword />} />
                {files && files.length > 0 ? (
                  <Route path="/" element={<BudgetList />} />
                ) : (
                  <Route path="/" element={<WelcomeScreen />} />
                )}

                {multiuserEnabled && (
                  <Route
                    path="/user-directory"
                    element={
                      <ProtectedRoute
                        permission={Permissions.ADMINISTRATOR}
                        element={
                          <UserDirectoryPage
                            bottomContent={<BackToFileListButton />}
                          />
                        }
                      />
                    }
                  />
                )}
                {/* Redirect all other pages to this route */}
                <Route path="/*" element={<Navigate to="/" />} />
              </Routes>

              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  padding: '6px 10px',
                  zIndex: 4000,
                }}
              >
                <Routes>
                  <Route path="/config-server" element={null} />
                  <Route
                    path="/*"
                    element={
                      <LoggedInUser
                        hideIfNoServer
                        style={{ padding: '4px 7px' }}
                      />
                    }
                  />
                </Routes>
              </View>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/openid-cb" element={<OpenIdCallback />} />
              <Route path="/error" element={<Error />} />
              <Route path="/config-server" element={<ConfigServer />} />
              <Route path="/bootstrap" element={<Bootstrap />} />
              {multiuserEnabled && (
                <Route
                  path="/userdirectory"
                  element={
                    <ProtectedRoute
                      permission={Permissions.ADMINISTRATOR}
                      element={<UserDirectoryPage />}
                    />
                  }
                />
              )}

              {/* Redirect all other pages to this route */}
              <Route path="/*" element={<Navigate to="/bootstrap" replace />} />
            </Routes>
          )}
        </View>
      )}

      <Routes>
        <Route path="/config-server" element={null} />
        <Route path="/*" element={<ServerURL />} />
      </Routes>
      <Version />
    </View>
  );
}

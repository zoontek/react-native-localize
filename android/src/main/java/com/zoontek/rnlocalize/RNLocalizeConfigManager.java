package com.zoontek.rnlocalize;

import android.content.res.Configuration;

public class RNLocalizeConfigManager {
  public static final RNLocalizeConfigManager shared = new RNLocalizeConfigManager();
  private RNLocalizeConfigManager() {}

  public interface RNLocalizeConfigManagerDelegate {
    void onConfigurationChanged(Configuration newConfig);
  }
  public RNLocalizeConfigManagerDelegate delegate;

  public void onConfigurationChanged(Configuration newConfig) {
    if(delegate != null) {
      delegate.onConfigurationChanged(newConfig);
    }
  }
}

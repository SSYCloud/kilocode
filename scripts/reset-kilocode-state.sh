#!/bin/sh

echo "Kilocode state is being reset.  This probably doesn't work while VS Code is running."

# Reset the secrets:
sqlite3 ~/Library/Application\ Support/Code/User/globalStorage/state.vscdb \
"DELETE FROM ItemTable WHERE \
    key = 'shengsuan-cloud.kilo-ssy' OR \
    key LIKE 'workbench.view.extension.kilo-ssy%' OR \
    key LIKE 'secret://{\"extensionId\":\"shengsuan-cloud.kilo-ssy\",%';"

# delete all kilocode state files:
rm -rf ~/Library/Application\ Support/Code/User/globalStorage/shengsuan-cloud.kilo-ssy/

# clear some of the vscode cache that I've observed contains kilocode related entries:
rm ~/Library/Application\ Support/Code/CachedProfilesData/__default__profile__/extensions.user.cache

DEST_ROOT='/mnt/nfs'
DEST_DIR1='Db-Snapshots'
DEST_DIR2='System-Info'

SOURCE_IP='192.168.11.111'
SOURCE_ROOT='/data'

sudo mount $SOURCE_IP:$SOURCE_ROOT/$DEST_DIR1 $DEST_ROOT/$DEST_DIR1
sudo mount $SOURCE_IP:$SOURCE_ROOT/$DEST_DIR2 $DEST_ROOT/$DEST_DIR2
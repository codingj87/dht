/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.Application', {
    extend: 'Ext.data.Store',
    alias: 'store.application',

    fields: ['value', 'display', 'desc'],
    data: [
        ['1', 'afs', 'Andrew Filesystem Protocol Suite'],
        ['12', 'aim', 'AOL Instant Messenger'],
        ['13', 'ares', 'Ares file transfer'],
        ['14', 'bgp', 'Border Gateway Protocol (BGP4)'],
        ['15', 'bittorrent', 'BitTorrent Filesharing'],
        ['9', 'blubster', 'Blubster P2P Chat, Filesharing, Voice'],
        ['16', 'citrix', 'Citrix protocol'],
        ['19', 'corba', 'Common Object Request Broker Architecture(tm)/IIOP(tm)'],
        ['20', 'cups', 'Common Unix Printing System'],
        ['21', 'cvs', 'CVS version control system'],
        ['22', 'daap', 'Digital Audio Access Protocol (iTunes)'],
        ['68', 'db2', 'IBM Database Server'],
        ['23', 'dcerpc', 'DCE Remote Procedure Call'],
        ['24', 'dht', 'Dynamic Host Configuration Protocol (BOOTP)'],
        ['25', 'dns', 'Domain Name System (internet domain name lookup)'],
        ['26', 'edonkey', 'eDonkey peer-to-peer file sharing'],
        ['42', 'emule', 'eMule P2P Filesharing'],
        ['11', 'encryptedfilexfer', 'P2P File Sharing'],
        ['28', 'fasttrack', 'FastTrack/KaZaA peer-to-peer filesharing'],
        ['29', 'ftp', 'File Transfer Protocol'],
        ['30', 'gadugadu', 'Gadu-Gadu instant messaging'],
        ['31', 'git', 'Git Version Control System'],
        ['32', 'gnutella', 'Peer to peer filesharing (BearShare/Gnucleus/LimeWire/Shareaza)'],
        ['51', 'gopher', 'Text interface predecessor of HTTP'],
        ['33', 'groupwise', 'Novell Groupwise - IM over HTTP'],
        ['120', 'h245', 'H.245 Control Channel protocol'],
        ['34', 'h323', 'H.323 protocol suite - VOIP'],
        ['35', 'http', 'Hypertext Transfer Protocol'],
        ['36', 'iax', 'Inter-Asterisk eXchange protocol'],
        ['39', 'icq', 'ICQ IM client, chat, file transfer, voice'],
        ['38', 'icy', 'ICY/SHOUTcast audio streaming'],
        ['40', 'imap', 'Internet Message Access Protocol'],
        ['48', 'imeem', 'imeem P2P Filesharing'],
        ['41', 'ipp', 'Internet Printing Protocol'],
        ['43', 'irc', 'Internet Relay Chat'],
        ['44', 'isakmp', 'Internet Security Association and Key Management Protocol'],
        ['45', 'kerberos', 'Kerberos secure authentication protocol'],
        ['47', 'ldap', 'Lightweight Directory Access Protocol'],
        ['46', 'lotusnotes', 'Lotus (IBM) collaboration software'],
        ['49', 'lpd', 'Unix Line Printer Daemon'],
        ['3', 'macromedia-fcs', 'Macromedia Flash Communications Server'],
        ['50', 'mapi', 'Messaging Application Programming Interface (DCERPC)'],
        ['52', 'megaco', 'H.248 VoIP protocol'],
        ['53', 'mgcp', 'Media Gateway Control Protocol'],
        ['55', 'msn', 'Microsoft Messenger Service - IM'],
        ['56', 'mute', 'MUTE-net peer-to-peer filesharing'],
        ['57', 'mysql', 'MySQL database server'],
        ['58', 'ncp', 'NetWare Core Protocol'],
        ['59', 'netbios_ns', 'NetBIOS name server'],
        ['60', 'netflow', 'NetFlow 1, 5, 7, 8 or 9'],
        ['61', 'nfs', 'Network File System (over RPC)'],
        ['62', 'nmdc', 'NeoModus Direct Connect protocol'],
        ['63', 'nntp', 'Network News Transfer Protocol'],
        ['4', 'nntps', 'Network News Transfer Protocol over TLS/SSL'],
        ['64', 'ntp', 'Network Time Protocol'],
        ['65', 'openft', 'Open FastTrack P2P filesharing (giFT)'],
        ['66', 'opennap', 'Open source Napster peer-to-peer filesharing'],
        ['67', 'oracle', 'Oracle TNS Protocol'],
        ['2', 'other', 'Traffic that is not classified as any other application'],
        ['24000', 'other TCP', 'TCP Traffic that is not classified as any other application'],
        ['24001', 'other UDP', 'UDP Traffic that is not classified as any other application'],
        ['27', 'pando', 'Pando, P2PTV, P2P sharing using BitTorrent protocol'],
        ['75', 'pop', 'Post Office Protocol - email'],
        ['76', 'postgresql', 'PostgreSQL protocol version 3.0'],
        ['6', 'ppstream', 'Video Streaming from ppstream.com'],
        ['54', 'pptp', 'Point-to-point Tunneling Protocol'],
        ['78', 'qq', 'QQ instant messaging'],
        ['18', 'qqlive', 'QQLive IM/Chat/Video Streaming'],
        ['79', 'quake1', 'Quake1 gaming protocol'],
        ['80', 'quake3', 'Quake3 - quake2, quake3, wolf and others'],
        ['82', 'rdp', 'Remote Desktop Protocol'],
        ['83', 'rdt', 'RealNetworks Real Data Transport protocol'],
        ['85', 'rip', 'Routing Information Protocol'],
        ['86', 'rlogin', 'Unix remote command line access'],
        ['87', 'rpc', 'Remote Procedure Call'],
        ['88', 'rsync', 'Unix remote file synchronization'],
        ['69', 'rtcp', 'RTP Control Protocol'],
        ['89', 'rtp', 'Real-time Transport Protocol'],
        ['90', 'rtsp', 'Real Time Streaming Protocol'],
        ['91', 'sametime', 'Lotus Sametime'],
        ['92', 'sccp', 'Skinny Client Control Protocol'],
        ['93', 'sip', 'Session Initiation Protocol'],
        ['95', 'slp', 'Service Location Protocol Version 2'],
        ['96', 'smb', 'Server Message Block (samba)'],
        ['97', 'smtp', 'Simple Mail Transfer Protocol'],
        ['98', 'snmp', 'Simple Network Management Protocol'],
        ['99', 'soap', 'Simple Object Access Protocol'],
        ['100', 'soulseek', 'Soulseek peer-to-peer filesharing'],
        ['101', 'ssdp', 'Simple Service Discovery Protocol'],
        ['102', 'ssh', 'Secure SHell'],
        ['103', 'ssl', 'Secure Socket Layer 2.0, 3.0, 3.1/TLS 1.0'],
        ['104', 'stun', 'Simple Traversal of UDP over NATS'],
        ['105', 'svn', 'Subversion Version Control System'],
        ['106', 'syslog', 'Unix syslog facility'],
        ['107', 'tacacs', 'Terminal Access Controller Access-Control System'],
        ['108', 'tds', 'Tabular Data Stream, versions 4, 5, 7, 8'],
        ['109', 'teamspeak', 'Teamspeak - VOIP'],
        ['110', 'telnet', 'TELetype NETwork - remote terminal'],
        ['111', 'tftp', 'Trivial File Transfer Protocol'],
        ['37', 'tvkoo', 'TVKoo Video Streaming'],
        ['112', 'ventrilo', 'Ventrilo VoIP Protocol'],
        ['113', 'vnc', 'Virtual Network Computing - remote frame buffer'],
        ['8', 'winmx', 'WinMX, Japanese P2P Filesharing'],
        ['10', 'winny', 'Winny, Japanese P2P Filesharing'],
        ['114', 'x11', 'X window system'],
        ['117', 'xmpp', 'Extensible Messaging and Presence Protocol'],
        ['5', 'xunlei', 'Xunlei, Chinese P2P Filesharing'],
        ['118', 'yahoo', 'Yahoo instant messenger protocol'],
        ['17', 'youtube', 'YouTube Video Streaming using HTTP'],
        ['7', 'zattoo', 'Zattoo P2PTV'],
        ['119', 'zephyr', 'MIT Zephyr protocol']
    ]
});
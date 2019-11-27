/**
 * Created by zen on 19. 4. 25.
 */
Ext.define('dhcp.view.windows.dhcptemplateswindow.DHCPTemplatesWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.form.field.Hidden',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.Card',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.toolbar.Fill',
    'Ext.toolbar.Paging',
    'Ext.toolbar.TextItem'
  ],
  width: 900,
  referenceHolder: true,
  defaultListenerScope: true,
  scrollable: true,
  modal: true,
  xtype: 'dhcptemplateswindow',

  viewModel: {
    stores: {
      optionsStore: {
        fields: ['value', 'text'],
        proxy: {
          type: 'ajax',
          url: '/dhcp_templates/options/',
          reader: {
            type: 'json',
            rootProperty: 'data'
          }
        },
        autoLoad: true
      }
    },
    data: {
      template: `    subnet %(subnet)s netmask %(net_mask)s {
        dynamic-dhcp range %(range_start)s %(range_end)s class %(class)s {
            option subnet-mask %(net_mask)s;
            option routers %(router)s;
        }
    }`,
      isData: false,
      desc: {
        pad: `  The pad option can be used to cause subsequent fields to align on word boundaries.

  The code for the pad option is 0, and its length is 1 octet.

    Code
   +-----+
   |  0  |
   +-----+`,
        'time-offset': `   The time offset field specifies the offset of the client's subnet in
   seconds from Coordinated Universal Time (UTC).  The offset is
   expressed as a two's complement 32-bit integer.  A positive offset
   indicates a location east of the zero meridian and a negative offset
   indicates a location west of the zero meridian.

   The code for the time offset option is 2, and its length is 4 octets.

    Code   Len        Time Offset
   +-----+-----+-----+-----+-----+-----+
   |  2  |  4  |  n1 |  n2 |  n3 |  n4 |
   +-----+-----+-----+-----+-----+-----+`,
        'time-server': `   The time server option specifies a list of RFC 868 [6] time servers
   available to the client.  Servers SHOULD be listed in order of
   preference.

   The code for the time server option is 4.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   
    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  4  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'name-server': `   The name server option specifies a list of IEN 116 [7] name servers
   available to the client.  Servers SHOULD be listed in order of
   preference.

   The code for the name server option is 5.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  5  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'domain-name-servers': `   The domain name server option specifies a list of Domain Name System
   (STD 13, RFC 1035 [8]) name servers available to the client.  Servers
   SHOULD be listed in order of preference.

   The code for the domain name server option is 6.  The minimum length
   for this option is 4 octets, and the length MUST always be a multiple
   of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  6  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'log-server': `   The log server option specifies a list of MIT-LCS UDP log servers
   available to the client.  Servers SHOULD be listed in order of
   preference.

   The code for the log server option is 7.  The minimum length for this
   option is 4 octets, and the length MUST always be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  7  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'cookie-server': `   The cookie server option specifies a list of RFC 865 [9] cookie
   servers available to the client.  Servers SHOULD be listed in order
   of preference.

   The code for the log server option is 8.  The minimum length for this
   option is 4 octets, and the length MUST always be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  8  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'lpr-server': `   The LPR server option specifies a list of RFC 1179 [10] line printer
   servers available to the client.  Servers SHOULD be listed in order
   of preference.

   The code for the LPR server option is 9.  The minimum length for this
   option is 4 octets, and the length MUST always be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  9  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'impress-server': `   The Impress server option specifies a list of Imagen Impress servers
   available to the client.  Servers SHOULD be listed in order of
   preference.

   The code for the Impress server option is 10.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  10 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'resource-location-server': `   This option specifies a list of RFC 887 [11] Resource Location
   servers available to the client.  Servers SHOULD be listed in order
   of preference.
   The code for this option is 11.  The minimum length for this option
   is 4 octets, and the length MUST always be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  11 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'host-name': `   This option specifies the name of the client.  The name may or may
   not be qualified with the local domain name (see section 3.17 for the
   preferred way to retrieve the domain name).  See RFC 1035 for
   character set restrictions.

   The code for this option is 12, and its minimum length is 1.

    Code   Len                 Host Name
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  12 |  n  |  h1 |  h2 |  h3 |  h4 |  h5 |  h6 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'boot-file-size': `   This option specifies the length in 512-octet blocks of the default
   boot image for the client.  The file length is specified as an
   unsigned 16-bit integer.

   The code for this option is 13, and its length is 2.

    Code   Len   File Size
   +-----+-----+-----+-----+
   |  13 |  2  |  l1 |  l2 |
   +-----+-----+-----+-----+`,
        'merit-dump-file': `   This option specifies the path-name of a file to which the client's
   core image should be dumped in the event the client crashes.  The
   path is formatted as a character string consisting of characters from
   the NVT ASCII character set.

   The code for this option is 14.  Its minimum length is 1.

    Code   Len      Dump File Pathname
   +-----+-----+-----+-----+-----+-----+---
   |  14 |  n  |  n1 |  n2 |  n3 |  n4 | ...
   +-----+-----+-----+-----+-----+-----+---`,
        'domain-name': `   This option specifies the domain name that client should use when
   resolving hostnames via the Domain Name System.

   The code for this option is 15.  Its minimum length is 1.

    Code   Len        Domain Name
   +-----+-----+-----+-----+-----+-----+--
   |  15 |  n  |  d1 |  d2 |  d3 |  d4 |  ...
   +-----+-----+-----+-----+-----+-----+--
`,
        'dhcp-lease-time': `   This option is used in a client request (DHCPDISCOVER or DHCPREQUEST)
   to allow the client to request a lease time for the IP address.  In a
   server reply (DHCPOFFER), a DHCP server uses this option to specify
   the lease time it is willing to offer.
   The time is in units of seconds, and is specified as a 32-bit
   unsigned integer.

   The code for this option is 51, and its length is 4.

    Code   Len         Lease Time
   +-----+-----+-----+-----+-----+-----+
   |  51 |  4  |  t1 |  t2 |  t3 |  t4 |
   +-----+-----+-----+-----+-----+-----+
`,
        'swap-server': `   This specifies the IP address of the client's swap server.

   The code for this option is 16 and its length is 4.

    Code   Len    Swap Server Address
   +-----+-----+-----+-----+-----+-----+
   |  16 |  n  |  a1 |  a2 |  a3 |  a4 |
   +-----+-----+-----+-----+-----+-----+`,
        'root-path': `   This option specifies the path-name that contains the client's root
   disk.  The path is formatted as a character string consisting of
   characters from the NVT ASCII character set.

   The code for this option is 17.  Its minimum length is 1.

    Code   Len      Root Disk Pathname
   +-----+-----+-----+-----+-----+-----+---
   |  17 |  n  |  n1 |  n2 |  n3 |  n4 | ...
   +-----+-----+-----+-----+-----+-----+---`,
        'extensions-path': `   A string to specify a file, retrievable via TFTP, which contains
   information which can be interpreted in the same way as the 64-octet
   vendor-extension field within the BOOTP response, with the following
   exceptions:

          - the length of the file is unconstrained;
          - all references to Tag 18 (i.e., instances of the
            BOOTP Extensions Path field) within the file are
            ignored.
   The code for this option is 18.  Its minimum length is 1.

    Code   Len      Extensions Pathname
   +-----+-----+-----+-----+-----+-----+---
   |  18 |  n  |  n1 |  n2 |  n3 |  n4 | ...
   +-----+-----+-----+-----+-----+-----+---
`,
        'ip-forwarding-enable/disable': `   This option specifies whether the client should configure its IP
   layer for packet forwarding.  A value of 0 means disable IP
   forwarding, and a value of 1 means enable IP forwarding.

   The code for this option is 19, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  19 |  1  | 0/1 |
   +-----+-----+-----+`,
        'non-local-source-routing-enable/disable': `   This option specifies whether the client should configure its IP
   layer to allow forwarding of datagrams with non-local source routes
   (see Section 3.3.5 of [4] for a discussion of this topic).  A value
   of 0 means disallow forwarding of such datagrams, and a value of 1
   means allow forwarding.

   The code for this option is 20, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  20 |  1  | 0/1 |
   +-----+-----+-----+`,
        'policy-filter': `   This option specifies policy filters for non-local source routing.
   The filters consist of a list of IP addresses and masks which specify
   destination/mask pairs with which to filter incoming source routes.

   Any source routed datagram whose next-hop address does not match one
   of the filters should be discarded by the client.
   The code for this option is 21.  The minimum length of this option is
   8, and the length MUST be a multiple of 8.

    Code   Len         Address 1                  Mask 1
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
   |  21 |  n  |  a1 |  a2 |  a3 |  a4 |  m1 |  m2 |  m3 |  m4 |
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
           Address 2                  Mask 2
   +-----+-----+-----+-----+-----+-----+-----+-----+---
   |  a1 |  a2 |  a3 |  a4 |  m1 |  m2 |  m3 |  m4 | ...
   +-----+-----+-----+-----+-----+-----+-----+-----+---`,
        'maximum-datagram-reassembly-size': `   This option specifies the maximum size datagram that the client
   should be prepared to reassemble.  The size is specified as a 16-bit
   unsigned integer.  The minimum value legal value is 576.

   The code for this option is 22, and its length is 2.

    Code   Len      Size
   +-----+-----+-----+-----+
   |  22 |  2  |  s1 |  s2 |
   +-----+-----+-----+-----+`,
        'default-ip-time-to-live': `   This option specifies the default time-to-live that the client should
   use on outgoing datagrams.  The TTL is specified as an octet with a
   value between 1 and 255.

   The code for this option is 23, and its length is 1.

    Code   Len   TTL
   +-----+-----+-----+
   |  23 |  1  | ttl |
   +-----+-----+-----+`,
        'path-mtu-aging-timeout': `   This option specifies the timeout (in seconds) to use when aging Path
   MTU values discovered by the mechanism defined in RFC 1191 [12].  The
   timeout is specified as a 32-bit unsigned integer.

   The code for this option is 24, and its length is 4.
    Code   Len           Timeout
   +-----+-----+-----+-----+-----+-----+
   |  24 |  4  |  t1 |  t2 |  t3 |  t4 |
   +-----+-----+-----+-----+-----+-----+`,
        'path-mtu-plateau-table': `   This option specifies a table of MTU sizes to use when performing
   Path MTU Discovery as defined in RFC 1191.  The table is formatted as
   a list of 16-bit unsigned integers, ordered from smallest to largest.
   The minimum MTU value cannot be smaller than 68.

   The code for this option is 25.  Its minimum length is 2, and the
   length MUST be a multiple of 2.

    Code   Len     Size 1      Size 2
   +-----+-----+-----+-----+-----+-----+---
   |  25 |  n  |  s1 |  s2 |  s1 |  s2 | ...
   +-----+-----+-----+-----+-----+-----+---`,
        'interface-mtu': `   This option specifies the MTU to use on this interface.  The MTU is
   specified as a 16-bit unsigned integer.  The minimum legal value for
   the MTU is 68.

   The code for this option is 26, and its length is 2.

    Code   Len      MTU
   +-----+-----+-----+-----+
   |  26 |  2  |  m1 |  m2 |
   +-----+-----+-----+-----+`,
        'all-subnets-are-local': `   This option specifies whether or not the client may assume that all
   subnets of the IP network to which the client is connected use the
   same MTU as the subnet of that network to which the client is
   directly connected.  A value of 1 indicates that all subnets share
   the same MTU.  A value of 0 means that the client should assume that
   some subnets of the directly connected network may have smaller MTUs.
   The code for this option is 27, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  27 |  1  | 0/1 |
   +-----+-----+-----+`,
        'broadcast-address': `   This option specifies the broadcast address in use on the client's
   subnet.  Legal values for broadcast addresses are specified in
   section 3.2.1.3 of [4].

   The code for this option is 28, and its length is 4.

    Code   Len     Broadcast Address
   +-----+-----+-----+-----+-----+-----+
   |  28 |  4  |  b1 |  b2 |  b3 |  b4 |
   +-----+-----+-----+-----+-----+-----+`,
        'perform-mask-discovery': `   This option specifies whether or not the client should perform subnet
   mask discovery using ICMP.  A value of 0 indicates that the client
   should not perform mask discovery.  A value of 1 means that the
   client should perform mask discovery.

   The code for this option is 29, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  29 |  1  | 0/1 |
   +-----+-----+-----+`,
        'mask-supplier': `   This option specifies whether or not the client should respond to
   subnet mask requests using ICMP.  A value of 0 indicates that the
   client should not respond.  A value of 1 means that the client should
   respond.

   The code for this option is 30, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  30 |  1  | 0/1 |
   +-----+-----+-----+`,
        'perform-router-discovery': `   This option specifies whether or not the client should solicit
   routers using the Router Discovery mechanism defined in RFC 1256
   [13].  A value of 0 indicates that the client should not perform
   router discovery.  A value of 1 means that the client should perform
   router discovery.

   The code for this option is 31, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  31 |  1  | 0/1 |
   +-----+-----+-----+`,
        'router-solicitation-address': `   This option specifies the address to which the client should transmit
   router solicitation requests.

   The code for this option is 32, and its length is 4.

    Code   Len            Address
   +-----+-----+-----+-----+-----+-----+
   |  32 |  4  |  a1 |  a2 |  a3 |  a4 |
   +-----+-----+-----+-----+-----+-----+`,
        'static-route': `   This option specifies a list of static routes that the client should
   install in its routing cache.  If multiple routes to the same
   destination are specified, they are listed in descending order of
   priority.

   The routes consist of a list of IP address pairs.  The first address
   is the destination address, and the second address is the router for
   the destination.

   The default route (0.0.0.0) is an illegal destination for a static
   route.  See section 3.5 for information about the router option.

   The code for this option is 33.  The minimum length of this option is
   8, and the length MUST be a multiple of 8.
    Code   Len         Destination 1           Router 1
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
   |  33 |  n  |  d1 |  d2 |  d3 |  d4 |  r1 |  r2 |  r3 |  r4 |
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
           Destination 2           Router 2
   +-----+-----+-----+-----+-----+-----+-----+-----+---
   |  d1 |  d2 |  d3 |  d4 |  r1 |  r2 |  r3 |  r4 | ...
   +-----+-----+-----+-----+-----+-----+-----+-----+---`,
        'trailer-encapsulation': `   This option specifies whether or not the client should negotiate the
   use of trailers (RFC 893 [14]) when using the ARP protocol.  A value
   of 0 indicates that the client should not attempt to use trailers.  A
   value of 1 means that the client should attempt to use trailers.

   The code for this option is 34, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  34 |  1  | 0/1 |
   +-----+-----+-----+`,
        'arp-cache-timeout': `   This option specifies the timeout in seconds for ARP cache entries.
   The time is specified as a 32-bit unsigned integer.

   The code for this option is 35, and its length is 4.

    Code   Len           Time
   +-----+-----+-----+-----+-----+-----+
   |  35 |  4  |  t1 |  t2 |  t3 |  t4 |
   +-----+-----+-----+-----+-----+-----+`,
        'ethernet-encapsulation': `   This option specifies whether or not the client should use Ethernet
   Version 2 (RFC 894 [15]) or IEEE 802.3 (RFC 1042 [16]) encapsulation
   if the interface is an Ethernet.  A value of 0 indicates that the
   client should use RFC 894 encapsulation.  A value of 1 means that the
   client should use RFC 1042 encapsulation.
   The code for this option is 36, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  36 |  1  | 0/1 |
   +-----+-----+-----+`,
        'tcp-default-ttl': `   This option specifies the default TTL that the client should use when
   sending TCP segments.  The value is represented as an 8-bit unsigned
   integer.  The minimum value is 1.

   The code for this option is 37, and its length is 1.

    Code   Len   TTL
   +-----+-----+-----+
   |  37 |  1  |  n  |
   +-----+-----+-----+`,
        'tcp-keepalive-interval': `   This option specifies the interval (in seconds) that the client TCP
   should wait before sending a keepalive message on a TCP connection.
   The time is specified as a 32-bit unsigned integer.  A value of zero
   indicates that the client should not generate keepalive messages on
   connections unless specifically requested by an application.

   The code for this option is 38, and its length is 4.

    Code   Len           Time
   +-----+-----+-----+-----+-----+-----+
   |  38 |  4  |  t1 |  t2 |  t3 |  t4 |
   +-----+-----+-----+-----+-----+-----+`,
        'tcp-keepalive-garbage': `   This option specifies the whether or not the client should send TCP
   keepalive messages with a octet of garbage for compatibility with
   older implementations.  A value of 0 indicates that a garbage octet
   should not be sent. A value of 1 indicates that a garbage octet
   should be sent.
   The code for this option is 39, and its length is 1.

    Code   Len  Value
   +-----+-----+-----+
   |  39 |  1  | 0/1 |
   +-----+-----+-----+
`,
        'nis-domain': `   This option specifies the name of the client's NIS [17] domain.  The
   domain is formatted as a character string consisting of characters
   from the NVT ASCII character set.

   The code for this option is 40.  Its minimum length is 1.

    Code   Len      NIS Domain Name
   +-----+-----+-----+-----+-----+-----+---
   |  40 |  n  |  n1 |  n2 |  n3 |  n4 | ...
   +-----+-----+-----+-----+-----+-----+---`,
        'network-information-servers': `   This option specifies a list of IP addresses indicating NIS servers
   available to the client.  Servers SHOULD be listed in order of
   preference.

   The code for this option is 41.  Its minimum length is 4, and the
   length MUST be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  41 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'network-time-protocol-servers': `   This option specifies a list of IP addresses indicating NTP [18]
   servers available to the client.  Servers SHOULD be listed in order
   of preference.

   The code for this option is 42.  Its minimum length is 4, and the
   length MUST be a multiple of 4.
    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  42 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'vendor-specific-information': `   This option is used by clients and servers to exchange vendor-
   specific information.  The information is an opaque object of n
   octets, presumably interpreted by vendor-specific code on the clients
   and servers.  The definition of this information is vendor specific.
   The vendor is indicated in the vendor class identifier option.
   Servers not equipped to interpret the vendor-specific information
   sent by a client MUST ignore it (although it may be reported).
   Clients which do not receive desired vendor-specific information
   SHOULD make an attempt to operate without it, although they may do so
   (and announce they are doing so) in a degraded mode.

   If a vendor potentially encodes more than one item of information in
   this option, then the vendor SHOULD encode the option using
   "Encapsulated vendor-specific options" as described below:

   The Encapsulated vendor-specific options field SHOULD be encoded as a
   sequence of code/length/value fields of identical syntax to the DHCP
   options field with the following exceptions:

      1) There SHOULD NOT be a "magic cookie" field in the encapsulated
         vendor-specific extensions field.

      2) Codes other than 0 or 255 MAY be redefined by the vendor within
         the encapsulated vendor-specific extensions field, but SHOULD
         conform to the tag-length-value syntax defined in section 2.

      3) Code 255 (END), if present, signifies the end of the
         encapsulated vendor extensions, not the end of the vendor
         extensions field. If no code 255 is present, then the end of
         the enclosing vendor-specific information field is taken as the
         end of the encapsulated vendor-specific extensions field.

   The code for this option is 43 and its minimum length is 1.

   Code   Len   Vendor-specific information
   +-----+-----+-----+-----+---
   |  43 |  n  |  i1 |  i2 | ...
   +-----+-----+-----+-----+---
   When encapsulated vendor-specific extensions are used, the
   information bytes 1-n have the following format:

    Code   Len   Data item        Code   Len   Data item       Code
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
   |  T1 |  n  |  d1 |  d2 | ... |  T2 |  n  |  D1 |  D2 | ... | ... |
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+`,
        'netbios-over-tcp/ip-name-servers': `   The NetBIOS name server (NBNS) option specifies a list of RFC
   1001/1002 [19] [20] NBNS name servers listed in order of preference.

   The code for this option is 44.  The minimum length of the option is
   4 octets, and the length must always be a multiple of 4.

    Code   Len           Address 1              Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+----
   |  44 |  n  |  a1 |  a2 |  a3 |  a4 |  b1 |  b2 |  b3 |  b4 | ...
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+----
`,
        'netbios-over-tcp/ip-datagram-distribution-servers': `   The NetBIOS datagram distribution server (NBDD) option specifies a
   list of RFC 1001/1002 NBDD servers listed in order of preference. The
   code for this option is 45.  The minimum length of the option is 4
   octets, and the length must always be a multiple of 4.

    Code   Len           Address 1              Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+----
   |  45 |  n  |  a1 |  a2 |  a3 |  a4 |  b1 |  b2 |  b3 |  b4 | ...
   +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+----`,
        'netbios-over-tcp/ip-node-type': `   The NetBIOS node type option allows NetBIOS over TCP/IP clients which
   are configurable to be configured as described in RFC 1001/1002.  The
   value is specified as a single octet which identifies the client type
   as follows:

      Value         Node Type
      -----         ---------
      0x1           B-node
      0x2           P-node
      0x4           M-node
      0x8           H-node
   In the above chart, the notation '0x' indicates a number in base-16
   (hexadecimal).

   The code for this option is 46.  The length of this option is always
   1.

    Code   Len  Node Type
   +-----+-----+-----------+
   |  46 |  1  | see above |
   +-----+-----+-----------+`,
        'netbios-over-tcp/ip-scope': `   The NetBIOS scope option specifies the NetBIOS over TCP/IP scope
   parameter for the client as specified in RFC 1001/1002. See [19],
   [20], and [8] for character-set restrictions.

   The code for this option is 47.  The minimum length of this option is
   1.

    Code   Len       NetBIOS Scope
   +-----+-----+-----+-----+-----+-----+----
   |  47 |  n  |  s1 |  s2 |  s3 |  s4 | ...
   +-----+-----+-----+-----+-----+-----+----`,
        'x-window-system-font-servers': `   This option specifies a list of X Window System [21] Font servers
   available to the client. Servers SHOULD be listed in order of
   preference.

   The code for this option is 48.  The minimum length of this option is
   4 octets, and the length MUST be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+---
   |  48 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |   ...
   +-----+-----+-----+-----+-----+-----+-----+-----+---`,
        'x-window-system-display-manager': `
           This option specifies a list of IP addresses of systems that are
   running the X Window System Display Manager and are available to the
   client.

   Addresses SHOULD be listed in order of preference.
   The code for the this option is 49. The minimum length of this option
   is 4, and the length MUST be a multiple of 4.

    Code   Len         Address 1               Address 2

   +-----+-----+-----+-----+-----+-----+-----+-----+---
   |  49 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |   ...
   +-----+-----+-----+-----+-----+-----+-----+-----+---`,
        'requested-ip-address': `   This option is used in a client request (DHCPDISCOVER) to allow the
   client to request that a particular IP address be assigned.

   The code for this option is 50, and its length is 4.

    Code   Len          Address
   +-----+-----+-----+-----+-----+-----+
   |  50 |  4  |  a1 |  a2 |  a3 |  a4 |
   +-----+-----+-----+-----+-----+-----+
`,
        'ip-address-lease-time': `   This option is used in a client request (DHCPDISCOVER or DHCPREQUEST)
   to allow the client to request a lease time for the IP address.  In a
   server reply (DHCPOFFER), a DHCP server uses this option to specify
   the lease time it is willing to offer.
   The time is in units of seconds, and is specified as a 32-bit
   unsigned integer.

   The code for this option is 51, and its length is 4.

    Code   Len         Lease Time
   +-----+-----+-----+-----+-----+-----+
   |  51 |  4  |  t1 |  t2 |  t3 |  t4 |
   +-----+-----+-----+-----+-----+-----+`,
        'option-overload': `   This option is used to indicate that the DHCP 'sname' or 'file'
   fields are being overloaded by using them to carry DHCP options. A
   DHCP server inserts this option if the returned parameters will
   exceed the usual space allotted for options.

   If this option is present, the client interprets the specified
   additional fields after it concludes interpretation of the standard
   option fields.

   The code for this option is 52, and its length is 1.  Legal values
   for this option are:

           Value   Meaning
           -----   --------
             1     the 'file' field is used to hold options
             2     the 'sname' field is used to hold options
             3     both fields are used to hold options

    Code   Len  Value
   +-----+-----+-----+
   |  52 |  1  |1/2/3|
   +-----+-----+-----+`,
        'dhcp-message-type': `   This option is used to convey the type of the DHCP message.  The code
   for this option is 53, and its length is 1.  Legal values for this
   option are:

           Value   Message Type
           -----   ------------
             1     DHCPDISCOVER
             2     DHCPOFFER
             3     DHCPREQUEST
             4     DHCPDECLINE
             5     DHCPACK
             6     DHCPNAK
             7     DHCPRELEASE
             8     DHCPINFORM

    Code   Len  Type
   +-----+-----+-----+
   |  53 |  1  | 1-9 |
   +-----+-----+-----+`,
        'server-identifier': `   This option is used in DHCPOFFER and DHCPREQUEST messages, and may
   optionally be included in the DHCPACK and DHCPNAK messages.  DHCP
   servers include this option in the DHCPOFFER in order to allow the
   client to distinguish between lease offers.  DHCP clients use the
   contents of the 'server identifier' field as the destination address
   for any DHCP messages unicast to the DHCP server.  DHCP clients also
   indicate which of several lease offers is being accepted by including
   this option in a DHCPREQUEST message.

   The identifier is the IP address of the selected server.

   The code for this option is 54, and its length is 4.
    Code   Len            Address
   +-----+-----+-----+-----+-----+-----+
   |  54 |  4  |  a1 |  a2 |  a3 |  a4 |
   +-----+-----+-----+-----+-----+-----+`,
        'parameter-request-list': `   This option is used by a DHCP client to request values for specified
   configuration parameters.  The list of requested parameters is
   specified as n octets, where each octet is a valid DHCP option code
   as defined in this document.

   The client MAY list the options in order of preference.  The DHCP
   server is not required to return the options in the requested order,
   but MUST try to insert the requested options in the order requested
   by the client.

   The code for this option is 55.  Its minimum length is 1.

    Code   Len   Option Codes
   +-----+-----+-----+-----+---
   |  55 |  n  |  c1 |  c2 | ...
   +-----+-----+-----+-----+---`,
        message: `   This option is used by a DHCP server to provide an error message to a
   DHCP client in a DHCPNAK message in the event of a failure. A client
   may use this option in a DHCPDECLINE message to indicate the why the
   client declined the offered parameters.  The message consists of n
   octets of NVT ASCII text, which the client may display on an
   available output device.

   The code for this option is 56 and its minimum length is 1.

    Code   Len     Text
   +-----+-----+-----+-----+---
   |  56 |  n  |  c1 |  c2 | ...
   +-----+-----+-----+-----+---`,
        'maximum-dhcp-message-size': `   This option specifies the maximum length DHCP message that it is
   willing to accept.  The length is specified as an unsigned 16-bit
   integer.  A client may use the maximum DHCP message size option in
   DHCPDISCOVER or DHCPREQUEST messages, but should not use the option
   in DHCPDECLINE messages.
   The code for this option is 57, and its length is 2.  The minimum
   legal value is 576 octets.

    Code   Len     Length
   +-----+-----+-----+-----+
   |  57 |  2  |  l1 |  l2 |
   +-----+-----+-----+-----+`,
        'renewal-time-value': `   This option specifies the time interval from address assignment until
   the client transitions to the RENEWING state.

   The value is in units of seconds, and is specified as a 32-bit
   unsigned integer.

   The code for this option is 58, and its length is 4.

    Code   Len         T1 Interval
   +-----+-----+-----+-----+-----+-----+
   |  58 |  4  |  t1 |  t2 |  t3 |  t4 |
   +-----+-----+-----+-----+-----+-----+`,
        'rebinding-time-value': `   This option specifies the time interval from address assignment until
   the client transitions to the REBINDING state.

   The value is in units of seconds, and is specified as a 32-bit
   unsigned integer.

   The code for this option is 59, and its length is 4.

    Code   Len         T2 Interval
   +-----+-----+-----+-----+-----+-----+
   |  59 |  4  |  t1 |  t2 |  t3 |  t4 |
   +-----+-----+-----+-----+-----+-----+`,
        'vendor-class-identifier': `   This option is used by DHCP clients to optionally identify the vendor
   type and configuration of a DHCP client.  The information is a string
   of n octets, interpreted by servers.  Vendors may choose to define
   specific vendor class identifiers to convey particular configuration
   or other identification information about a client.  For example, the
   identifier may encode the client's hardware configuration.  Servers
   not equipped to interpret the class-specific information sent by a
   client MUST ignore it (although it may be reported). Servers that
   respond SHOULD only use option 43 to return the vendor-specific
   information to the client.

   The code for this option is 60, and its minimum length is 1.

   Code   Len   Vendor class Identifier
   +-----+-----+-----+-----+---
   |  60 |  n  |  i1 |  i2 | ...
   +-----+-----+-----+-----+---`,
        'client-identifier': `   This option is used by DHCP clients to specify their unique
   identifier.  DHCP servers use this value to index their database of
   address bindings.  This value is expected to be unique for all
   clients in an administrative domain.

   Identifiers SHOULD be treated as opaque objects by DHCP servers.

   The client identifier MAY consist of type-value pairs similar to the
   'htype'/'chaddr' fields defined in [3]. For instance, it MAY consist
   of a hardware type and hardware address. In this case the type field
   SHOULD be one of the ARP hardware types defined in STD2 [22].  A
   hardware type of 0 (zero) should be used when the value field
   contains an identifier other than a hardware address (e.g. a fully
   qualified domain name).

   For correct identification of clients, each client's client-
   identifier MUST be unique among the client-identifiers used on the
   subnet to which the client is attached.  Vendors and system
   administrators are responsible for choosing client-identifiers that
   meet this requirement for uniqueness.

   The code for this option is 61, and its minimum length is 2.

   Code   Len   Type  Client-Identifier
   +-----+-----+-----+-----+-----+---
   |  61 |  n  |  t1 |  i1 |  i2 | ...
   +-----+-----+-----+-----+-----+---`,
        'network-information-service+-domain': `   This option specifies the name of the client's NIS+ [17] domain.  The
   domain is formatted as a character string consisting of characters
   from the NVT ASCII character set.

   The code for this option is 64.  Its minimum length is 1.

    Code   Len      NIS Client Domain Name
   +-----+-----+-----+-----+-----+-----+---
   |  64 |  n  |  n1 |  n2 |  n3 |  n4 | ...
   +-----+-----+-----+-----+-----+-----+---`,
        'network-information-service+-servers': `   This option specifies a list of IP addresses indicating NIS+ servers
   available to the client.  Servers SHOULD be listed in order of
   preference.

   The code for this option is 65.  Its minimum length is 4, and the
   length MUST be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   |  65 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--
`,
        'tftp-server-name': `   This option is used to identify a TFTP server when the 'sname' field
   in the DHCP header has been used for DHCP options.

   The code for this option is 66, and its minimum length is 1.

       Code  Len   TFTP server
      +-----+-----+-----+-----+-----+---
      | 66  |  n  |  c1 |  c2 |  c3 | ...
      +-----+-----+-----+-----+-----+---`,
        'bootfile-name': `   This option is used to identify a bootfile when the 'file' field in
   the DHCP header has been used for DHCP options.

   The code for this option is 67, and its minimum length is 1.

       Code  Len   Bootfile name
      +-----+-----+-----+-----+-----+---
      | 67  |  n  |  c1 |  c2 |  c3 | ...
      +-----+-----+-----+-----+-----+---`,
        'mobile-ip-home-agent': `   This option specifies a list of IP addresses indicating mobile IP
   home agents available to the client.  Agents SHOULD be listed in
   order of preference.

   The code for this option is 68.  Its minimum length is 0 (indicating
   no home agents are available) and the length MUST be a multiple of 4.
   It is expected that the usual length will be four octets, containing
   a single home agent's address.
    Code Len    Home Agent Addresses (zero or more)
   +-----+-----+-----+-----+-----+-----+--
   | 68  |  n  | a1  | a2  | a3  | a4  | ...
   +-----+-----+-----+-----+-----+-----+--`,
        'smtp-server': `   The SMTP server option specifies a list of SMTP servers available to
   the client.  Servers SHOULD be listed in order of preference.

   The code for the SMTP server option is 69.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 69  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'pop3-server': `   The POP3 server option specifies a list of POP3 available to the
   client.  Servers SHOULD be listed in order of preference.

   The code for the POP3 server option is 70.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 70  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'nntp-server': `   The NNTP server option specifies a list of NNTP available to the
   client.  Servers SHOULD be listed in order of preference.

   The code for the NNTP server option is 71. The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 71  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'default-www-server': `   The WWW server option specifies a list of WWW available to the
   client.  Servers SHOULD be listed in order of preference.

   The code for the WWW server option is 72.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 72  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'default-finger-server': `   The Finger server option specifies a list of Finger available to the
   client.  Servers SHOULD be listed in order of preference.

   The code for the Finger server option is 73.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 73  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'default-irc-server': `   The IRC server option specifies a list of IRC available to the
   client.  Servers SHOULD be listed in order of preference.

   The code for the IRC server option is 74.  The minimum length for
   this option is 4 octets, and the length MUST always be a multiple of
   4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 74  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'default-streettalk-server': `   The StreetTalk server option specifies a list of StreetTalk servers
   available to the client.  Servers SHOULD be listed in order of
   preference.
   The code for the StreetTalk server option is 75.  The minimum length
   for this option is 4 octets, and the length MUST always be a multiple
   of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 75  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'default-streettalk-directory-assistance-server': `   The StreetTalk Directory Assistance (STDA) server option specifies a
   list of STDA servers available to the client.  Servers SHOULD be
   listed in order of preference.

   The code for the StreetTalk Directory Assistance server option is 76.
   The minimum length for this option is 4 octets, and the length MUST
   always be a multiple of 4.

    Code   Len         Address 1               Address 2
   +-----+-----+-----+-----+-----+-----+-----+-----+--
   | 76  |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
   +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'user-class': `   This option is used by a DHCP client to optionally identify the type
   or category of user or applications it represents.  A DHCP server
   uses the User Class option to choose the address pool it allocates an
   address from and/or to select any other configuration option.

   This option is a DHCP option [1, 2].

   This option MAY carry multiple User Classes.  Servers may interpret
   the meanings of multiple class specifications in an implementation
   dependent or configuration dependent manner, and so the use of
   multiple classes by a DHCP client should be based on the specific
   server implementation and configuration which will be used to process
   that User class option.

   The format of this option is as follows:

         Code   Len   Value
        +-----+-----+---------------------  . . .  --+
        | 77  |  N  | User Class Data ('Len' octets) |
        +-----+-----+---------------------  . . .  --+

   where Value consists of one or more instances of User Class Data.
   Each instance of User Class Data is formatted as follows:
     UC_Len_i     User_Class_Data_i
        +--------+------------------------  . . .  --+
        |  L_i   | Opaque-Data ('UC_Len_i' octets)   |
        +--------+------------------------  . . .  --+

   Each User Class value (User_Class_Data_i) is indicated as an opaque
   field.  The value in UC_Len_i does not include the length field
   itself and MUST be non-zero.  Let m be the number of User Classes
   carried in the option.  The length of the option as specified in Len
   must be the sum of the lengths of each of the class names plus m:
   Len= UC_Len_1 + UC_Len_2 + ... + UC_Len_m + m.  If any instances of
   User Class Data are present, the minimum value of Len is two (Len =
   UC_Len_1 + 1 = 1 + 1 = 2).

   The Code for this option is 77.

   A server that is not equipped to interpret any given user class
   specified by a client MUST ignore it (although it may be reported).
   If a server recognizes one or more user classes specified by the
   client, but does not recognize one or more other user classes
   specified by the client, the server MAY use the user classes it
   recognizes.

   DHCP clients implementing this option SHOULD allow users to enter one
   or more user class values.`,
        'client-fqdn': `   To update the IP-address-to-FQDN mapping, a DHCP server needs to know
   the FQDN of the client to which the server leases the address.  To
   allow the client to convey its FQDN to the server, this document
   defines a new DHCP option, called "Client FQDN".  The Client FQDN
   option also contains Flags, which DHCP servers can use to convey
   information about DNS updates to clients, and two deprecated RCODEs.

   Clients MAY send the Client FQDN option, setting appropriate Flags
   values, in both their DHCPDISCOVER and DHCPREQUEST messages.  If a
   client sends the Client FQDN option in its DHCPDISCOVER message, it
   MUST send the option in subsequent DHCPREQUEST messages though the
   contents of the option MAY change.

   Only one Client FQDN option MAY appear in a message, though it may be
   instantiated in a message as multiple options [9].  DHCP clients and
   servers supporting this option MUST implement DHCP option
   concatenation [9].  In the terminology of [9], the Client FQDN option
   is a concatenation-requiring option.

   The code for this option is 81.  Len contains the number of octets
   that follow the Len field, and the minimum value is 3 (octets).
   The format of the Client FQDN option is:

        Code   Len    Flags  RCODE1 RCODE2   Domain Name
       +------+------+------+------+------+------+--
       |  81  |   n  |      |      |      |       ...
       +------+------+------+------+------+------+--

   The above figure follows the conventions of [12].`,
        'relay-agent-information': ` This document defines a new DHCP Option called the Relay Agent
   Information Option.  It is a "container" option for specific agent-
   supplied sub-options.  The format of the Relay Agent Information
   option is:

          Code   Len     Agent Information Field
         +------+------+------+------+------+------+--...-+------+
         |  82  |   N  |  i1  |  i2  |  i3  |  i4  |      |  iN  |
         +------+------+------+------+------+------+--...-+------+

   The length N gives the total number of octets in the Agent
   Information Field.  The Agent Information field consists of a
   sequence of SubOpt/Length/Value tuples for each sub-option, encoded
   in the following manner:

          SubOpt  Len     Sub-option Value
         +------+------+------+------+------+------+--...-+------+
         |  1   |   N  |  s1  |  s2  |  s3  |  s4  |      |  sN  |
         +------+------+------+------+------+------+--...-+------+
          SubOpt  Len     Sub-option Value
         +------+------+------+------+------+------+--...-+------+
         |  2   |   N  |  i1  |  i2  |  i3  |  i4  |      |  iN  |
         +------+------+------+------+------+------+--...-+------+

   No "pad" sub-option is defined, and the Information field shall NOT
   be terminated with a 255 sub-option.  The length N of the DHCP Agent
   Information Option shall include all bytes of the sub-option
   code/length/value tuples.  Since at least one sub-option must be
   defined, the minimum Relay Agent Information length is two (2).  The
   length N of the sub-options shall be the number of octets in only
   that sub-option's value field.  A sub-option length may be zero.  The
   sub-options need not appear in sub-option code order.

   The initial assignment of DHCP Relay Agent Sub-options is as follows:

                 DHCP Agent              Sub-Option Description
                 Sub-option Code
                 ---------------         ----------------------
                     1                   Agent Circuit ID Sub-option
                     2                   Agent Remote ID Sub-option
`,
        'client-last-transaction-time': `          This option allows the receiver to determine the time of the
          most recent access of the client.  It is particularly useful
          when DHCPLEASEACTIVE messages from two different DHCP servers
          need to be compared, although it can be useful in other
          situations.  The value is a duration in seconds from the
          current time into the past when this IP address was most
          recently the subject of communication between the client and
          the DHCP server.

          This MUST NOT be an absolute time.  This MUST NOT be an
          absolute number of seconds since Jan. 1, 1970.  Instead, this
          MUST be an integer number of seconds in the past from the time
          the DHCPLEASEACTIVE message is sent that the client last dealt
          with this server about this IP address.  In the same way that
          the IP Address Lease Time option (option 51) encodes a lease
          time that is a number of seconds into the future from the time
          the message was sent, this option encodes a value that is a
          number of seconds into the past from when the message was
          sent.
          
          The code for the this option is 91.  The length of the this
          option is 4 octets.

              Code   Len      Seconds in the past
             +-----+-----+-----+-----+-----+-----+
             |  91 |  4  |  t1 |  t2 |  t3 |  t4 |
             +-----+-----+-----+-----+-----+-----+`,
        'associated-ip': `          This option is used to return all of the IP addresses
          associated with the DHCP client specified in a particular
          DHCPLEASEQUERY message.

          The code for this option is 92.  The minimum length for this
          option is 4 octets, and the length MUST always be a multiple
          of 4.

              Code   Len         Address 1               Address 2
             +-----+-----+-----+-----+-----+-----+-----+-----+--
             |  92 |  n  |  a1 |  a2 |  a3 |  a4 |  a1 |  a2 |  ...
             +-----+-----+-----+-----+-----+-----+-----+-----+--`,
        'user-auth': `   This option specifies a list of URLs, each pointing to a user
   authentication service that is capable of processing authentication
   requests encapsulated in the User Authentication Protocol (UAP).  UAP
   servers can accept either HTTP 1.1 or SSLv3 connections.  If the list
   includes a URL that does not contain a port component, the normal
   default port is assumed (i.e., port 80 for http and port 443 for
   https).  If the list includes a URL that does not contain a path
   component, the path /uap is assumed.

   0                   1                   2                   3
   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |     Code      |    Length     |   URL list
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

      Code            98

      Length          The length of the data field (i.e., URL list) in
                      bytes.

      URL list        A list of one or more URLs separated by the ASCII
                      space character (0x20).`,
        'disable-stateless-auto-configuration-in-ipv4-clients': ``,
        'voip-configuration-server': ``
      }
    },
    selectedDesc: ''
  },

  height: 800,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  bodyPadding: 10,
  items: [
    {
      xtype: 'form',
      reference: 'form',
      padding: 5,
      frame: true,
      layout: {
        type: 'hbox',
        align: 'stretch'
      },
      items: [
        {
          xtype: 'textfield',
          name: 'name',
          flex: 1,
          margin: 5,
          allowBlank: false,
          bind: '{name}',
          fieldLabel: '템플릿 명'
        }
      ]
    },

    {
      xtype: 'form',
      margin: '20 0 0 0',
      reference: 'form2',
      padding: 5,
      frame: true,
      layout: {
        type: 'hbox',
        align: 'stretch'
      },
      defaults: {
        flex: 2,
        margin: 5
      },
      items: [
        {
          xtype: 'combobox',
          valueField: 'value',
          fieldLabel: '옵션',
          name: 'option',
          displayField: 'text',
          allowBlank: false,
          listeners: {
            change: 'onChange'
          },
          bind: {
            store: '{optionsStore}'
          }
        },
        {
          xtype: 'textfield',
          name: 'optionValue',
          fieldLabel: '옵션 값',
          allowBlank: false
        },
        {
          xtype: 'button',
          cls: 'bg_create',
          flex: 1,
          handler: 'onAdd',
          text: '추가'
        }
      ]
    },
    {
      xtype: 'grid',
      reference: 'grid',
      flex: 1,
      border: true,
      scrollable: true,
      columns: {
        defaults: { align: 'center', flex: 1 },
        items: [
          { text: '옵션', dataIndex: 'option' },
          {
            text: '옵션 값',
            dataIndex: 'option_value'
          },
          {
            text: '-',
            xtype: 'widgetcolumn',
            widget: {
              xtype: 'button',
              text: '삭제',
              cls: 'bg_delete',
              handler: 'onDelete'
            }
          }
        ]
      },
      listeners: {
        afterrender: 'onRenderGrid'
      }
    },
    {
      xtype: 'panel',
      margin: '20 0 0 0',
      height: 300,
      padding: 20,
      scrollable: true,
      frame: true,
      items: [
        {
          xtype: 'displayfield',
          bind: '<pre>{selectedDesc}</pre>'
        }
      ]
    }
  ],
  buttons: [
    { xtype: 'button', text: '저장', handler: 'onSave' },
    { xtype: 'button', text: '닫기', handler: 'onClose' }
  ],

  onRenderGrid: function(grid) {
    const vm = this.getViewModel();
    const options = vm.get('options');
    const store = Ext.create('Ext.data.Store', {
      proxy: {
        type: 'memory',
        data:
          vm.get('mode') === 'update'
            ? options.map(item => ({
                option: item.value,
                option_value: item.optionValue
              }))
            : [],
        reader: {
          type: 'json'
        }
      }
    });
    grid.reconfigure(store);
    store.load();
  },

  onSave: async function() {
    const form = this.lookupReference('form');
    const vm = this.getViewModel();
    if (form.isValid()) {
      const grid = this.lookupReference('grid');
      const options = [];
      const pk = vm.get('pk');
      grid.getStore().each(record => {
        options.push({
          value: record.get('option'),
          optionValue: record.get('option_value')
        });
      });
      this.saveTemplate(null, options);
      const response = await dht.ajax(`/dhcp_templates/${vm.get('mode')}/`, {
        name: form.getValues().name,
        template: vm.get('template'),
        options: JSON.stringify(options),
        pk
      });
      if (response.success) {
        this.fireEvent('save');
        this.destroy();
      } else {
        Ext.Msg.alert('알림', response.errMsg);
      }
    }
  },
  onClose: function() {
    this.destroy();
  },
  saveTemplate: function(form, newData) {
    const vm = this.getViewModel();
    const template = vm.get('template');
    const splitted = template.split('\n');
    const prefix = splitted.slice(0, 4).join('\n');
    const suffix = splitted
      .slice(splitted.length - 2, splitted.length)
      .join('\n');
    const added = newData
      .map(item => {
        return `option ${item.value} ${item.optionValue};`;
      })
      .join(`\n${' '.repeat(12)}`);

    vm.set(
      'template',
      `${prefix}${added ? `\n${' '.repeat(12)}${added}` : ''}\n${suffix}`
    );

    vm.set(
      'optionsTemplate',
      newData.map(item => `${item.value} => ${item.optionValue}`).join('\n')
    );
    if (newData.length > 0) {
      vm.set('isData', true);
    } else {
      vm.set('isData', false);
    }
    if (form) {
      form.reset();
    }
  },
  onDelete: function(cp) {
    const record = cp.$widgetRecord;
    const grid = this.lookupReference('grid');
    const data = [];
    grid.getStore().each(r => {
      if (r.get('option') !== record.get('option')) {
        data.push(r);
      }
    });
    grid.getStore().loadData(data);
  },
  onAdd: function() {
    const form = this.lookupReference('form2');
    if (form.isValid()) {
      const grid = this.lookupReference('grid');
      const formValues = form.getValues();
      let isDuplicate = false;
      grid.getStore().each(record => {
        if (record.get('option') === formValues.option) {
          isDuplicate = true;
        }
      });
      if (isDuplicate) {
        Ext.Msg.alert(
          '알림',
          `이미 ${formValues.option} 옵션이 있습니다. 삭제 후 진행해주세요`
        );
      } else {
        grid.getStore().add({
          option: formValues.option,
          option_value: formValues.optionValue
        });
        form.reset();
      }
    }
  },
  onChange: function(combobox, value) {
    const vm = this.getViewModel();
    vm.set('selectedDesc', vm.get('desc')[value]);
  }
});

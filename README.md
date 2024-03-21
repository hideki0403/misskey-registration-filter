# Misskey Registration Filter
Misskeyのアカウント登録時に特定のCountry/AS/UserAgentを満たすユーザーの登録を拒否できるようにする、Cloudflare WorkersのWorkerです。

## セットアップ
1. KVを作成する
```bash
pnpx wrangler kv:namespace create KV

# ✨ Success!
# Add the following to your configuration file in your kv_namespaces array:
# { binding = "KV", id = "551140f776e14d82ac680e777918eef8" }
```
2. 表示されたIDを控えておく (上記の場合は`551140f776e14d82ac680e777918eef8`)
3. `wrangler.toml`のkv_namespaces内にあるidを書き換える
```diff
[[kv_namespaces]]
binding = "KV"
-id = "9c19c252207c4fcca434e044025b095e"
+id = "551140f776e14d82ac680e777918eef8"
```
4. `pnpm run deploy`でデプロイをする
5. Cloudflareのダッシュボードから、先程作成したKVを編集する
   - Workers & Pages -> KV -> misskey-registration-filter-KV -> view
   - 下記の「設定項目」を参考に、キーと値を追加
6. Workers Routesにルートを追加
   1. Workers & Pages -> Overview -> misskey-registration-filter
   2. Settings -> Triggers -> Add route
   3. `<domain>/api/signup`をRouteに入力 (ex. `misskey.example.com/api/signup`)
   4. Save

## 設定項目 (KV)

### `ua`
特定のUserAgentからの登録を拒否する場合に設定します。  
Valueは任意のUserAgentを指定します。
カンマで区切ることで、複数のUserAgentを指定できます。  
値は部分一致、ケースセンシティブで扱われます。  

- Key: `ua`
- ExampleValue: `CrOS,Bot`

### `country`
特定の国からの登録を拒否する場合に設定します。  
Valueは[ISO-3166-1 alpha-2 codes](https://www.iban.com/country-codes)に基づいた国コードを指定します。
カンマで区切ることで、複数の国コードを指定できます。  
例外として、torからのアクセスを拒否する場合は`tor`と指定します。
- Key: `country`
- ExampleValue: `jp,us,tor`

### `euCountry`
EU圏内からの登録を拒否する場合に設定します。  
Valueは`true`を指定します。

- Key: `euCountry`
- ExampleValue: `true`

### `asn`
特定のASからの登録を拒否する場合に設定します。  
Valueは[AS番号](https://2ip.io/analytics/asn-list/)を指定します。
カンマで区切ることで、複数のAS番号を指定できます。

- Key: `asn`
- ExampleValue: `395747,15169`

### `asOrganization`
特定のASからの登録を拒否する場合に設定します。  
ValueはASの組織名を指定します。
カンマで区切ることで、複数の組織名を指定できます。  
値は部分一致、ケースセンシティブで扱われます。  

- Key: `asOrganization`
- ExampleValue: `Google Cloud,AWS`

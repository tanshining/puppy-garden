# Puppy Garden

一个使用 Vite、TypeScript 和 Three.js 制作的原创治愈系 3D 花园箱庭。所有主要模型均由程序化几何体生成，没有外部三维模型依赖。

## 在线访问

项目推送到 GitHub 的 `main` 分支后，会由 `.github/workflows/deploy-pages.yml` 自动构建并发布到 GitHub Pages。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

如果本机使用 pnpm，也可以将命令中的 `npm` 换成 `pnpm`。

## 交互

- 鼠标拖动或单指拖动：环游花园
- 滚轮或双指手势：缩放
- 单击小狗：跟随它并显示名字与状态
- 单击空白：退出跟随
- 右下角“环绕”：切换自动环绕
- 右下角“重置”：回到初始视角

## 项目结构

```text
.
├─ public/favicon.svg
├─ src/main.ts
├─ src/style.css
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

## 性能设计

- 使用共享材质和低面数程序化几何体
- 花朵、草叶与树冠细节使用 `InstancedMesh`
- 限制设备像素比，移动端降低阴影分辨率
- 页面隐藏时暂停动画时钟
- 支持 `prefers-reduced-motion`
- 离开页面时释放渲染器、材质和几何体资源

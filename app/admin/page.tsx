"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Photo = {
  id: string;
  blobUrl: string;
  guestName: string | null;
  message: string | null;
  approved: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pendingPhotos, setPendingPhotos] = useState<Photo[]>([]);
  const [approvedPhotos, setApprovedPhotos] = useState<Photo[]>([]);
  const [autoApproveUploads, setAutoApproveUploads] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadPhotos = useCallback(async () => {
    try {
      const [pendingRes, approvedRes, settingsRes] = await Promise.all([
        fetch("/api/photos?pending=true"),
        fetch("/api/photos"),
        fetch("/api/admin/settings"),
      ]);

      if (pendingRes.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (!pendingRes.ok || !approvedRes.ok) {
        setActionError("写真の読み込みに失敗しました。");
        return;
      }

      setAuthenticated(true);
      setPendingPhotos((await pendingRes.json()) as Photo[]);
      setApprovedPhotos((await approvedRes.json()) as Photo[]);

      if (settingsRes.ok) {
        const settings = (await settingsRes.json()) as {
          autoApproveUploads: boolean;
        };
        setAutoApproveUploads(settings.autoApproveUploads);
      } else {
        setAutoApproveUploads(true);
      }
    } catch {
      setActionError("写真の読み込みに失敗しました。");
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setLoginError("パスワードが正しくありません。");
      return;
    }

    setPassword("");
    await loadPhotos();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPendingPhotos([]);
    setApprovedPhotos([]);
  };

  const patchPhoto = async (id: string, approved: boolean) => {
    setActionError("");
    const res = await fetch(`/api/photos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });

    if (!res.ok) {
      setActionError("操作に失敗しました。");
      return;
    }

    await loadPhotos();
  };

  const deletePhoto = async (id: string) => {
    setActionError("");
    const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });

    if (!res.ok) {
      setActionError("削除に失敗しました。");
      return;
    }

    await loadPhotos();
  };

  const handleAutoApproveChange = async (checked: boolean) => {
    const previous = autoApproveUploads;
    setAutoApproveUploads(checked);
    setActionError("");
    setIsSavingSettings(true);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoApproveUploads: checked }),
    });

    setIsSavingSettings(false);

    if (!res.ok) {
      setAutoApproveUploads(previous);
      setActionError("設定の保存に失敗しました。");
      return;
    }

    const settings = (await res.json()) as { autoApproveUploads: boolean };
    setAutoApproveUploads(settings.autoApproveUploads);
  };

  if (authenticated === null) {
    return (
      <main>
        <h1>管理画面</h1>
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main>
        <h1>管理画面</h1>
        <form onSubmit={handleLogin}>
          <p>
            <label>
              パスワード
              <br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </p>
          {loginError && <p>{loginError}</p>}
          <button type="submit">ログイン</button>
        </form>
      </main>
    );
  }

  return (
    <main>
      <h1>管理画面</h1>
      <p>
        <button type="button" onClick={handleLogout}>
          ログアウト
        </button>
      </p>
      {actionError && <p>{actionError}</p>}

      <section>
        <h2>設定</h2>
        <label>
          <input
            type="checkbox"
            checked={autoApproveUploads}
            onChange={(e) => void handleAutoApproveChange(e.target.checked)}
            disabled={isSavingSettings}
          />{" "}
          アップロード写真を自動公開
        </label>
        <p>オフにすると、公開前に管理者の承認が必要になります。</p>
      </section>

      <section>
        <h2>審核待ち</h2>
        {pendingPhotos.length === 0 ? (
          <p>審核待ちの写真はありません。</p>
        ) : (
          <ul>
            {pendingPhotos.map((photo) => (
              <li key={photo.id}>
                <Image
                  src={photo.blobUrl}
                  alt={photo.guestName ?? "Pending photo"}
                  width={200}
                  height={200}
                  style={{ width: "auto", height: "auto", maxWidth: 200 }}
                />
                {photo.guestName && <p>{photo.guestName}</p>}
                {photo.message && <p>{photo.message}</p>}
                <button type="button" onClick={() => patchPhoto(photo.id, true)}>
                  承認
                </button>{" "}
                <button type="button" onClick={() => deletePhoto(photo.id)}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>承認済み</h2>
        {approvedPhotos.length === 0 ? (
          <p>承認済みの写真はありません。</p>
        ) : (
          <ul>
            {approvedPhotos.map((photo) => (
              <li key={photo.id}>
                <Image
                  src={photo.blobUrl}
                  alt={photo.guestName ?? "Approved photo"}
                  width={200}
                  height={200}
                  style={{ width: "auto", height: "auto", maxWidth: 200 }}
                />
                {photo.guestName && <p>{photo.guestName}</p>}
                <button type="button" onClick={() => patchPhoto(photo.id, false)}>
                  承認取消
                </button>{" "}
                <button type="button" onClick={() => deletePhoto(photo.id)}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
